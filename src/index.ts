import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { UuidApi } from './service/UuidApi.js';

/**
 * コマンドライン引数を解析する
 * @returns 解析された引数オブジェクト
 */
function parseArgs(): { uuid?: string } {
  const args = process.argv.slice(2);
  let uuid: string | undefined = undefined;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--uuid' || args[i] === '-u') {
      uuid = args[i + 1];
      i++; // 次の引数はすでに処理したのでスキップ
    }
  }

  return { uuid };
}

/**
 * メイン関数
 */
async function main() {  
  const server = new McpServer({
    name: 'uuid-server',
    version: '1.0.0'
  });
  
  const uuidApi = new UuidApi();
  
  server.tool(
    'generate-uuid',
    {},
    async () => {
      const uuid = uuidApi.generateUuid();
      return {
        content: [{ type: 'text', text: uuid }]
      };
    }
  );

  server.tool(
    'generate-uuids',
    { count: z.number().min(1).max(100) },
    async ({ count }) => {
      const uuids = uuidApi.generateUuids(count);
      return {
        content: [{ type: 'text', text: uuids.join('\n') }]
      };
    }
  );

  server.tool(
    'detect-uuid-version',
    { uuid: z.string() },
    async ({ uuid }) => {
      const versionInfo = uuidApi.detectUuidVersion(uuid);
      
      if (versionInfo.isValid) {
        return {
          content: [{ 
            type: 'text', 
            text: `有効なUUID（バージョン: ${versionInfo.version}）` 
          }]
        };
      } 
      
      return {
        content: [{ type: 'text', text: '無効なUUID' }]
      };
    }
  );

  const { uuid: inputUuid } = parseArgs();
  if (inputUuid) {
    const versionInfo = uuidApi.detectUuidVersion(inputUuid);
    
    if (versionInfo.isValid) {
      console.log("UUIDの検証結果: 有効なUUID");
      console.log(`UUIDのバージョン: ${versionInfo.version !== null ? versionInfo.version : '不明'}`);
    } else {
      console.log("UUIDの検証結果: 無効なUUID");
    }
    
    process.exit(0);
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(error => {
  console.error('エラーが発生しました:', error);
});
