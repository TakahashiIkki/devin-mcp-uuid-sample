import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { UuidService } from '../service/UuidService.js';

/**
 * UUID生成と検証のためのMCPサーバークラス
 */
export class UuidServer {
  private server: Server;
  private uuidService: UuidService;

  /**
   * UuidServerのコンストラクタ
   */
  constructor() {
    this.server = new Server(
      {
        name: 'uuid-server',
        version: '1.0.0'
      },
      {
        capabilities: {
          resources: {},
          tools: {
            'generate-uuid': {
              description: 'UUIDを生成します',
              parameters: {}
            },
            'generate-uuids': {
              description: '複数のUUIDを生成します',
              parameters: {
                count: {
                  type: 'number',
                  description: '生成するUUIDの数'
                }
              }
            },
            'detect-uuid-version': {
              description: 'UUIDのバージョンを判定します',
              parameters: {
                uuid: {
                  type: 'string',
                  description: '判定するUUID'
                }
              }
            }
          },
          prompts: {}
        }
      }
    );
    
    this.uuidService = new UuidService();
    this.registerRequestHandlers();
  }

  /**
   * リクエストハンドラーを登録する
   */
  private registerRequestHandlers() {
    this.server.setRequestHandler(
      { method: 'callTool', params: { name: 'generate-uuid' } },
      async () => {
        const uuid = this.uuidService.generateUuid();
        return {
          content: [{ type: 'text', text: uuid }]
        };
      }
    );

    this.server.setRequestHandler(
      { method: 'callTool', params: { name: 'generate-uuids' } },
      async (request) => {
        const count = request.params?.params?.count as number || 1;
        const uuids = this.uuidService.generateUuids(count);
        return {
          content: [{ type: 'text', text: uuids.join('\n') }]
        };
      }
    );

    this.server.setRequestHandler(
      { method: 'callTool', params: { name: 'detect-uuid-version' } },
      async (request) => {
        const uuid = request.params?.params?.uuid as string;
        const versionInfo = this.uuidService.detectUuidVersion(uuid);
        
        if (versionInfo.isValid) {
          return {
            content: [{ 
              type: 'text', 
              text: `有効なUUID（バージョン: ${versionInfo.version}）` 
            }]
          };
        } else {
          return {
            content: [{ type: 'text', text: '無効なUUID' }]
          };
        }
      }
    );
  }

  /**
   * サーバーを起動する
   */
  async start() {
    console.log('UUID MCPサーバーを起動しています...');
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}
