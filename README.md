# devin-mcp-uuid-sample

MCPサーバーと連携したUUID生成および検証のためのTypeScriptサンプルプロジェクト。

## 概要

このプロジェクトは以下の機能を提供します：

- UUIDの生成（UUID v4）
    - 今、v4を勝手に作るようにしちゃっています. そのうち調整します.
- UUIDのバージョン検出と検証
- MCPサーバーとの接続

## インストール

```bash
npm install
```

## ビルド

```bash
npm run build
```

## 使用方法

```bash
npm start
```

### 開発モード

TypeScriptを直接実行する開発モード：

```bash
npm run dev
```

## MCPクライアントとの接続

- MCPクライアント（Devinなど）から接続するには、以下のいずれかの方法を使用します：
    - stdio接続: MCPクライアントから直接このプロジェクトを子プロセスとして起動
    - 外部プロセス接続: このプロジェクトを別プロセスとして起動し、MCPクライアントから接続

###  提供されるMCPツール
このMCPサーバーは以下のツールを提供します：

1. generate-uuid: 単一のUUIDを生成
1. generate-uuids: 指定された数のUUIDを生成（1〜100）
1. detect-uuid-version: 指定されたUUIDの有効性とバージョンを検証

### Memo: Claude Desktop からの設定

"mcpServers" に以下を追加することで動作が確認できた

```
{
  "mcpServers": {
    "{some-mcp-name}": {
      "command": "node",
      "args": [
        "/this/source/path/dist/src/index.js"
      ]
    }
  }
}
```

参考までに: https://x.com/ikkitang/status/1908895206709346329

### テスト

テストを実行：

```bash
# 全テストを一度実行
npm test

# ウォッチモードでテストを実行
npm run test:watch
```

## 技術スタック

- TypeScript
- Model Context Protocol (MCP) SDK
- UUID ライブラリ (v11.1.0)
- Vitest (テストフレームワーク)
