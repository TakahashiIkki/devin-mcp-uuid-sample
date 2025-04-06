import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { UuidApi } from '../service/UuidApi.js';

/**
 * UUID生成と検証のためのMCPサーバークラス
 */
export class UuidServer {
  private server: McpServer;
  private uuidApi: UuidApi;

  /**
   * UuidServerのコンストラクタ
   */
  constructor() {
    this.server = new McpServer({
      name: 'uuid-server',
      version: '1.0.0'
    });
    
    this.uuidApi = new UuidApi();
    this.registerTools();
  }

  /**
   * ツールを登録する
   */
  private registerTools() {
    this.server.tool(
      'generate-uuid',
      {},
      async () => {
        const uuid = this.uuidApi.generateUuid();
        return {
          content: [{ type: 'text', text: uuid }]
        };
      }
    );

    this.server.tool(
      'generate-uuids',
      { count: z.number().min(1).max(100) },
      async ({ count }) => {
        const uuids = this.uuidApi.generateUuids(count);
        return {
          content: [{ type: 'text', text: uuids.join('\n') }]
        };
      }
    );

    this.server.tool(
      'detect-uuid-version',
      { uuid: z.string() },
      async ({ uuid }) => {
        const versionInfo = this.uuidApi.detectUuidVersion(uuid);
        
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
