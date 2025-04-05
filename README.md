# devin-mcp-uuid-sample

MCPサーバーと連携したUUID生成および検証のためのTypeScriptサンプルプロジェクト。

## 概要

このプロジェクトは以下の機能を提供します：

- UUIDの生成（UUID v4）
- UUIDのバージョン検出と検証
- MCPサーバーとの接続（接続できない場合はローカルモードで動作）

## インストール

```bash
# 依存関係をインストール
npm install
```

## ビルド

```bash
# プロジェクトをビルド
npm run build
```

## 使用方法

### UUIDの生成

新しいUUIDを生成するには：

```bash
npm start
```

### UUIDの検証

既存のUUIDを検証するには：

```bash
npm start -- --uuid f47ac10b-58cc-4372-a567-0e02b2c3d479
```

または短い形式：

```bash
npm start -- -u f47ac10b-58cc-4372-a567-0e02b2c3d479
```

### 開発モード

TypeScriptを直接実行する開発モード：

```bash
npm run dev
```

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
