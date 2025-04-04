import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

/**
 * UUIDのバージョン情報
 */
export interface UuidVersionInfo {
  isValid: boolean;
  version: number | null;
}

/**
 * UUID生成のためのMCPクライアントクラス
 */
export class UuidClient {
  private client: Client;
  private connected: boolean = false;

  /**
   * UuidClientのコンストラクタ
   * @param serverCommand - MCPサーバーを起動するコマンド
   * @param serverArgs - サーバーコマンドの引数
   */
  constructor(private serverCommand: string = 'echo', private serverArgs: string[] = ['MCPサーバーが指定されていません']) {
    this.client = new Client(
      { name: 'uuid-client', version: '1.0.0' },
      { capabilities: { resources: {}, tools: {}, prompts: {} }}
    );
  }

  /**
   * サーバーに接続する
   */
  async connect(): Promise<void> {
    if (this.connected) {
      console.log('すでに接続されています');
      return;
    }

    try {
      const transport = new StdioClientTransport({
        command: this.serverCommand,
        args: this.serverArgs
      });

      await this.client.connect(transport);
      this.connected = true;
      console.log('MCPサーバーに接続しました');
    } catch (error) {
      console.error('接続エラー:', error);
      throw error;
    }
  }

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

    const versionChar = uuid.charAt(14);
    let version: number | null = null;

    if (versionChar === '1') {
      version = 1;
    } else if (versionChar === '2') {
      version = 2;
    } else if (versionChar === '3') {
      version = 3;
    } else if (versionChar === '4') {
      version = 4;
    } else if (versionChar === '5') {
      version = 5;
    }

    return { isValid: true, version };
  }
}
