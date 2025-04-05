import { UuidClient, UuidVersionInfo } from './client/index.js';

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
 * UUIDを生成して表示するメイン関数
 */
async function main() {
  console.log('MCP UUIDクライアントアプリを起動しています...');
  
  try {
    const { uuid: inputUuid } = parseArgs();
    const uuidClient = new UuidClient();
    
    try {
      await uuidClient.connect();
    } catch (error) {
      console.log('注意: MCPサーバーへの接続ができませんでした。ローカルモードで動作します。');
    }
    
    if (inputUuid) {
      console.log(`入力されたUUID: ${inputUuid}`);
      const versionInfo: UuidVersionInfo = uuidClient.detectUuidVersion(inputUuid);
      
      if (versionInfo.isValid) {
        console.log(`UUIDの検証結果: 有効なUUID`);
        console.log(`UUIDのバージョン: ${versionInfo.version !== null ? versionInfo.version : '不明'}`);
      } else {
        console.log(`UUIDの検証結果: 無効なUUID`);
      }
    } 
    else {
      console.log('UUIDを生成します:');
      
      const uuid = uuidClient.generateUuid();
      console.log(`生成されたUUID: ${uuid}`);
      
      const versionInfo = uuidClient.detectUuidVersion(uuid);
      console.log(`UUIDのバージョン: ${versionInfo.version}`);
      
      console.log('UUIDの生成が完了しました。');
    }
  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}

main().catch(error => {
  console.error('予期せぬエラーが発生しました:', error);
});
