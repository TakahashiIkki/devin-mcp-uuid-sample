import { UuidClient } from './client/index.js';

/**
 * UUIDを生成して表示するメイン関数
 */
async function main() {
  console.log('MCP UUIDクライアントアプリを起動しています...');
  
  try {
    const uuidClient = new UuidClient();
    
    try {
      await uuidClient.connect();
    } catch (error) {
      console.log('注意: MCPサーバーへの接続ができませんでした。ローカルモードで動作します。');
    }
    
    console.log('UUIDを生成します:');
    
    const uuid = uuidClient.generateUuid();
    console.log(`生成されたUUID: ${uuid}`);
    
    console.log('UUIDの生成が完了しました。');
  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}

main().catch(error => {
  console.error('予期せぬエラーが発生しました:', error);
});
