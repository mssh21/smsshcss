# @smsshcss/vite プレイグラウンド

このプレイグラウンドは、`@smsshcss/vite` プラグインの実際の使用例とテスト環境を提供します。Viteを使用して、SmsshCSSユーティリティのJIT（Just-In-Time）コンパイルをデモンストレーションしています。

## 機能

- Viteビルドプロセスとの統合
- JITによるユーティリティクラスの生成
- カスタマイズされたテーマ設定
- ホットモジュールリロード (HMR) 対応

## 使用方法

### 開発サーバーの起動

```bash
cd playground/@smsshcss/vite-playground
yarn dev
```

開発サーバーが http://localhost:5173 で起動します。

### 本番ビルド

```bash
cd playground/@smsshcss/vite-playground
yarn build
```

`dist` フォルダに最適化されたファイルが生成されます。

### ビルド結果のプレビュー

```bash
cd playground/@smsshcss/vite-playground
yarn preview
```

## 主要なファイル

- `vite.config.js` - Vite設定と@smsshcss/viteプラグインの設定
- `index.html` - メインHTMLファイル（各種ユーティリティクラスを使用）
- `src/main.js` - JavaScriptエントリーポイント

## カスタマイズ

`vite.config.js` ファイル内の `smsshcss` プラグイン設定を編集することで、テーマやその他のオプションをカスタマイズできます。
