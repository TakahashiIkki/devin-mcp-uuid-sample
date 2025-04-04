import { UuidClient } from './client/index.js';

/**
 * コマンドライン引数を解析する
 * @returns 解析された引数オブジェクト
 */
function parseArgs(): { count: number } {
  const args = process.argv.slice(2);
  let count = 1; // デフォルトは1つのUUIDを生成

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--count' || args[i] === '-c') {
      const countValue = args[i + 1];
      if (countValue && !isNaN(Number(countValue))) {
        count = Number(countValue);
        i++; // 次の引数はすでに処理したのでスキップ
      }
    }
  }

  return { count };
}

/**
 * UUIDを生成して表示するメイン関数
 */
async function main() {
  console.log('MCP UUIDクライアントアプリを起動しています...');
  
  try {
    const { count } = parseArgs();
    
    const uuidClient = new UuidClient();
    
    try {
      await uuidClient.connect();
    } catch (error) {
      console.log('注意: MCPサーバーへの接続ができませんでした。ローカルモードで動作します。');
    }
    
    console.log(`UUIDを${count}個生成します:`);
    
    const uuids = uuidClient.generateUuids(count);
    
    uuids.forEach((uuid, index) => {
      console.log(`UUID ${index + 1}: ${uuid}`);
    });
    
    console.log('UUIDの生成が完了しました。');
  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}

main().catch(error => {
  console.error('予期せぬエラーが発生しました:', error);
});
