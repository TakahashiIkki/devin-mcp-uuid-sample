import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { v4 as uuidv4, validate as uuidValidate, version as uuidVersion } from 'uuid';

/**
 * UUIDのバージョン情報
 */
interface UuidVersionInfo {
  isValid: boolean;
  version: number | null;
}

/**
 * UUID生成と検証のためのサービスクラス
 */
class UuidService {
  /**
   * UUIDを生成して返す
   * @returns 生成されたUUID
   */
  generateUuid(): string {
    return uuidv4();
  }
  
  /**
   * 指定された回数のUUIDを生成して返す
   * @param count - 生成するUUIDの数
   * @returns 生成されたUUIDの配列
   */
  generateUuids(count: number): string[] {
    const uuids: string[] = [];
    for (let i = 0; i < count; i++) {
      uuids.push(this.generateUuid());
    }
    return uuids;
  }

  /**
   * UUIDのバージョンを判定する
   * @param uuid - 判定するUUID文字列
   * @returns UUIDのバージョン情報
   */
  detectUuidVersion(uuid: string): UuidVersionInfo {
    if (!uuidValidate(uuid)) {
      return { isValid: false, version: null };
    }

    const version = uuidVersion(uuid);
    
    return { isValid: true, version };
  }
}

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
  console.log('UUID MCPサーバーを起動しています...');
  
  const server = new McpServer({
    name: 'uuid-server',
    version: '1.0.0'
  });
  
  const uuidService = new UuidService();
  
  server.tool(
    'generate-uuid',
    {},
    async () => {
      const uuid = uuidService.generateUuid();
      return {
        content: [{ type: 'text', text: uuid }]
      };
    }
  );

  server.tool(
    'generate-uuids',
    { count: z.number().min(1).max(100) },
    async ({ count }) => {
      const uuids = uuidService.generateUuids(count);
      return {
        content: [{ type: 'text', text: uuids.join('\n') }]
      };
    }
  );

  server.tool(
    'detect-uuid-version',
    { uuid: z.string() },
    async ({ uuid }) => {
      const versionInfo = uuidService.detectUuidVersion(uuid);
      
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

  const { uuid: inputUuid } = parseArgs();
  if (inputUuid) {
    console.log(`入力されたUUID: ${inputUuid}`);
    const versionInfo = uuidService.detectUuidVersion(inputUuid);
    
    if (versionInfo.isValid) {
      console.log(`UUIDの検証結果: 有効なUUID`);
      console.log(`UUIDのバージョン: ${versionInfo.version !== null ? versionInfo.version : '不明'}`);
    } else {
      console.log(`UUIDの検証結果: 無効なUUID`);
    }
    
    process.exit(0);
  }

  console.log('MCPサーバーを起動します...');
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(error => {
  console.error('エラーが発生しました:', error);
});
