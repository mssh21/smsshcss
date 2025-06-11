# SmsshCSS Vite Plugin Playground

このplaygroundは、SmsshCSS Vite Pluginの全機能を包括的にテストできる環境です。

## 🚀 起動方法

```bash
# プロジェクトルートから
cd playground/vite-plugin

# 依存関係をインストール（必要に応じて）
yarn install

# 開発サーバーを起動
yarn dev
```

または、プロジェクトルートから：

```bash
# Turboを使用して起動
yarn workspace @smsshcss/vite-plugin-playground dev
```

開発サーバーは `http://localhost:3000` で起動し、自動的にブラウザが開きます。

## 📋 テスト内容

このplaygroundでは以下の機能をテストできます：

### 1. 🎯 Spacing Classes (フィボナッチ数列)

- 基本パディング: `p-2xs` (5px) から `p-xl` (55px)
- 基本マージン: `m-2xs` から `m-xl`
- 方向別スペーシング: `mt-*`, `mr-*`, `mb-*`, `ml-*`, `mx-*`, `my-*`, `px-*`, `py-*`
- カスタム値: `p-[15px]`, `p-[2rem]`, `p-[var(--custom-padding)]`

### 2. 📏 Gap Classes

- Flexbox Gap: `gap-2xs` から `gap-xl`
- Grid Gap: 同上
- Gap-X/Gap-Y: `gap-x-*`, `gap-y-*`
- カスタム値Gap: `gap-[45px]`, `gap-x-[60px] gap-y-[20px]`

### 3. 📐 Width/Height Classes

- 基本サイズ: `w-2xs` から `w-xl`, `h-2xs` から `h-xl`
- パーセンテージ: `w-quarter`, `w-half`, `w-full`
- カスタム値: `w-[120px]`, `h-[60px]`, `w-[8rem]`

### 4. 🖥️ Display Classes

- 基本Display: `block`, `inline`, `inline-block`
- Flex/Grid: `flex`, `grid`
- 非表示: `hidden`

### 5. 🔄 Flexbox Classes

- Flex Direction: `flex-row`, `flex-col`
- Justify Content: `justify-start`, `justify-center`, `justify-end`, `justify-between`
- Align Items: `items-start`, `items-center`, `items-end`
- Flex Wrap: `flex-wrap`, `flex-nowrap`

### 6. 🎯 Grid Classes

- Grid Columns: `grid-cols-2`, `grid-cols-3`, `grid-cols-4`
- Grid Span: `col-span-2`, `col-span-3`
- Grid Start/End: `col-start-2 col-end-4`
- カスタム値Grid: `grid-cols-[200px_1fr_100px]`

### 7. ⚡ Apply Settings Demo

50以上のapply設定をテストできます：

#### レイアウト関連

- `main-layout`: `w-full max-w-6xl mx-auto px-lg py-xl`
- `container`: `w-full max-w-4xl mx-auto px-md`
- `section-spacing`: `py-xl px-lg`

#### ボタン系

- `btn`: 基本ボタンスタイル
- `btn-primary`: プライマリボタン
- `btn-secondary`: セカンダリボタン
- `btn-danger`: 危険アクションボタン
- `btn-sm`, `btn-lg`: サイズバリエーション

#### カード系

- `card`: 基本カードスタイル
- `card-header`, `card-body`, `card-footer`: カード内部要素

#### フレックス・グリッド関連

- `flex-center`: `flex justify-center items-center`
- `flex-between`: `flex justify-between items-center`
- `grid-2-cols`, `grid-3-cols`, `grid-4-cols`: グリッドレイアウト

#### タイポグラフィ

- `heading-1`, `heading-2`, `heading-3`: 見出しスタイル
- `body-text`: 本文テキスト
- `caption`: キャプション

#### フォーム関連

- `form-group`, `form-label`, `form-input`: フォーム要素
- `form-textarea`, `form-select`: 入力要素

#### ユーティリティ

- `stack-sm`, `stack-md`, `stack-lg`: 垂直スタック
- `inline-stack-*`: 水平スタック
- `interactive`: ホバー効果
- `disabled`: 無効状態
- `loading`: ローディング状態

### 8. 🎨 Custom Values Demo

- ピクセル値: `p-[15px]`, `w-[120px]`
- rem/em値: `p-[1.5rem]`, `w-[10rem]`
- パーセンテージ: `w-[75%]`, `h-[50%]`
- CSS変数: `p-[var(--custom-padding)]`
- calc()関数: `w-[calc(100%-20px)]`
- Grid値: `grid-cols-[200px_1fr_100px]`
- レスポンシブ: `clamp(1rem,4vw,2rem)`

## 🔧 設定内容

### Vite設定 (vite.config.js)

```javascript
smsshcss({
  includeReset: true,
  includeBase: true,
  minify: false,
  debug: true,

  purge: {
    enabled: false, // 開発時は無効
  },

  apply: {
    // 50以上の組み合わせクラス設定
  },
});
```

### 主要な特徴

1. **debug: true** - 詳細なログをコンソールに出力
2. **purge.enabled: false** - 開発時はすべてのクラスを利用可能
3. **豊富なapply設定** - 実用的な組み合わせクラス
4. **カスタム値サポート** - `[...]` 記法での任意値

## 🛠️ デバッグ機能

開発者ツールのコンソールで以下のデバッグ機能が利用できます：

```javascript
// すべてのクラス名を取得
window.smsshcssDebug.listAllClasses();

// 特定のクラスを使用している要素を検索
window.smsshcssDebug.findElementsWithClass('btn-primary');

// apply設定の一覧を取得
window.smsshcssDebug.getApplyClasses();
```

## 📊 統計情報

コンソールログで以下の情報を確認できます：

- SmsshCSS生成済みスタイルの検出
- 検出されたSmsshCSSクラス数
- 主要なクラスの一覧
- CSS生成状況

## 🎯 テストのポイント

1. **フィボナッチ数列の確認**: spacing値が正しく適用されているか
2. **Apply設定の動作**: 組み合わせクラスが期待通りに展開されるか
3. **カスタム値の処理**: `[...]` 記法が正しく処理されるか
4. **パフォーマンス**: 大量のクラスでも快適に動作するか
5. **ホットリロード**: ファイル変更時の自動再生成

## 📝 開発時の注意点

- 開発時は `purge.enabled: false` によりすべてのクラスが利用可能
- 本番ビルド時は使用されていないクラスが自動削除される
- `debug: true` により詳細なログが出力される
- カスタム値は実行時に動的生成される

このplaygroundを活用して、SmsshCSS Vite Pluginの全機能を体験してください！
