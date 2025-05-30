# @smsshcss/vite

SmsshCSSのViteプラグイン。CSSユーティリティクラスを自動生成し、プロジェクトに統合します。開発時は高速で、本番時はパージ機能により最適化されたCSSを提供します。

## インストール

```bash
# npm
npm install smsshcss @smsshcss/vite

# yarn
yarn add smsshcss @smsshcss/vite

# pnpm
pnpm add smsshcss @smsshcss/vite
```

## 使用方法

### 基本的な設定

`vite.config.js`に以下のように設定を追加します：

```javascript
import { defineConfig } from 'vite';
import smsshcss from '@smsshcss/vite';

export default defineConfig({
  plugins: [smsshcss()],
});
```

### 詳細な設定例

```javascript
import { defineConfig } from 'vite';
import smsshcss from '@smsshcss/vite';

export default defineConfig({
  plugins: [
    smsshcss({
      // リセットCSSとベースCSSの設定
      includeReset: true,
      includeBase: true,

      // スキャンするファイルパターン
      content: [
        'index.html',
        'src/**/*.{html,js,ts,jsx,tsx,vue,svelte}',
        'components/**/*.{js,ts,jsx,tsx,vue}',
        '**/*.html',
      ],

      // パージ設定（本番ビルド時の最適化）
      purge: {
        enabled: true,
        safelist: [
          // 使用していないけど保持したいクラス
          'm-2xl',
          'p-2xl',
          'gap-2xl',
          // パターンマッチング
          /^hover:/,
          /^focus:/,
        ],
        blocklist: [
          // 強制的に削除したいクラス
          'm-2xs',
          'p-2xs',
          /^deprecated-/,
        ],
        keyframes: true, // @keyframes のパージ
        fontFace: true, // @font-face のパージ
        variables: true, // CSS変数のパージ
      },

      // テーマのカスタマイズ
      theme: {
        spacing: {
          72: '18rem',
          84: '21rem',
          96: '24rem',
          custom: '2.5rem',
        },
        display: {
          'custom-flex': 'flex',
          'custom-grid': 'grid',
        },
      },

      // パージレポートの表示
      showPurgeReport: true,
    }),
  ],
});
```

## オプション

### SmsshCSSViteOptions

```typescript
interface SmsshCSSViteOptions {
  /**
   * スキャンするファイルパターン
   * @default ['index.html', 'src/**\/*.{html,js,ts,jsx,tsx,vue,svelte,astro}']
   */
  content?: string[];

  /**
   * リセットCSSを含めるかどうか
   * @default true
   */
  includeReset?: boolean;

  /**
   * ベースCSSを含めるかどうか
   * @default true
   */
  includeBase?: boolean;

  /**
   * パージ設定
   */
  purge?: {
    enabled?: boolean; // パージ機能の有効/無効
    safelist?: (string | RegExp)[]; // 削除しないクラス
    blocklist?: (string | RegExp)[]; // 強制削除するクラス
    keyframes?: boolean; // @keyframes のパージ
    fontFace?: boolean; // @font-face のパージ
    variables?: boolean; // CSS変数のパージ
  };

  /**
   * テーマのカスタマイズ
   */
  theme?: {
    spacing?: Record<string, string>;
    display?: Record<string, string>;
  };

  /**
   * 開発時にパージレポートを表示するかどうか
   * @default false
   */
  showPurgeReport?: boolean;

  /**
   * CSS minifyを有効にするかどうか
   * arbitrary value syntax使用時の警告を回避したい場合はfalseに設定
   * @default true
   */
  minify?: boolean;
}
```

## パージ機能

### 🎯 基本動作

- **開発時**: パージ無効 → 全クラス利用可能、高速ビルド
- **本番時**: パージ有効 → 未使用クラス削除、軽量化

### ✅ Safelist（保護リスト）

使用していないクラスでも本番ビルドで保持したい場合：

```javascript
safelist: [
  // 個別指定
  'btn-primary',
  'container',

  // パターンマッチング
  /^hover:/,
  /^focus:/,
  /^sm:/,
  /^md:/,
  /^lg:/,

  // 動的に生成されるクラス用
  /^bg-/,
  /^text-/,
];
```

### ❌ Blocklist（削除リスト）

使用していても強制的に削除したいクラス：

```javascript
blocklist: [
  // 個別指定
  'deprecated-class',

  // パターンマッチング
  /^old-/,
  /^legacy-/,
];
```

### 📊 パージレポート

`showPurgeReport: true` で本番ビルド時にレポート表示：

```
🎯 SmsshCSS Purge Report (Vite Plugin)
=====================================
📊 Total classes: 1,247
✅ Used classes: 342
🗑️  Purged classes: 905
⏱️  Build time: 156ms
📉 Size reduction: 72.6%
```

### ⚠️ CSS Minify設定

Tailwind CSS のarbitrary value syntax（`gap-[min(1rem, 3vw)]` など）を使用する際、ViteのCSS minifyプロセスで警告が発生することがあります。

```javascript
smsshcss({
  // CSS minifyを無効化して警告を回避
  minify: false,

  // または環境に応じて設定
  minify: process.env.NODE_ENV === 'development' ? false : true,
});
```

**設定の影響：**

- `minify: true`（デフォルト）: CSS圧縮有効、ファイルサイズ最小化
- `minify: false`: CSS圧縮無効、arbitrary value構文の警告回避

## パフォーマンス最適化

### 🚀 開発時の最適化

```javascript
// 開発時は同期処理で高速化
configureServer(devServer) {
  // ファイル変更時の自動リロード
  devServer.watcher.on('change', async (file) => {
    // CSSモジュールを無効化してリロード
  });
}
```

### 🎯 本番時の最適化

```javascript
// 本番時は非同期処理でパージ実行
if (isProduction && purge.enabled) {
  generatedCSS = await smsshGenerateCSS(smsshConfig);
}
```

## 生成されるユーティリティクラス

### Spacing（フィボナッチ数列ベース）

```css
/* マージン */
.m-2xs {
  margin: 5px;
}
.m-xs {
  margin: 8px;
}
.m-sm {
  margin: 12px;
}
.m-md {
  margin: 20px;
}
.m-lg {
  margin: 32px;
}
.m-xl {
  margin: 52px;
}
.m-2xl {
  margin: 84px;
}

/* 方向指定 */
.mt-lg {
  margin-top: 32px;
}
.mx-md {
  margin-left: 20px;
  margin-right: 20px;
}
.py-sm {
  padding-top: 12px;
  padding-bottom: 12px;
}

/* カスタム値 */
.m-[15px] {
  margin: 15px;
}
.p-[2rem] {
  padding: 2rem;
}
.gap-[calc(1rem+10px)] {
  gap: calc(1rem + 10px);
}
```

### Gap クラス

```css
/* 基本Gap */
.gap-sm {
  gap: 12px;
}
.gap-md {
  gap: 20px;
}
.gap-lg {
  gap: 32px;
}

/* 方向別Gap */
.gap-x-lg {
  column-gap: 32px;
}
.gap-y-sm {
  row-gap: 12px;
}

/* カスタム値Gap */
.gap-[25px] {
  gap: 25px;
}
.gap-x-[3rem] {
  column-gap: 3rem;
}
```

### Display

```css
.block {
  display: block;
}
.flex {
  display: flex;
}
.grid {
  display: grid;
}
.none {
  display: none;
}

/* カスタムディスプレイ */
.custom-flex {
  display: flex;
}
.custom-grid {
  display: grid;
}
```

## 使用例

### HTMLでの使用例

```html
<!-- 基本的なスペーシング -->
<div class="p-lg m-md">
  <h1 class="mb-sm">タイトル</h1>
  <p class="mt-xs">説明文</p>
</div>

<!-- フレックスボックス -->
<div class="flex gap-md">
  <div class="p-sm">アイテム1</div>
  <div class="p-sm">アイテム2</div>
</div>

<!-- グリッドレイアウト -->
<div class="grid gap-x-lg gap-y-sm" style="grid-template-columns: repeat(3, 1fr)">
  <div class="p-md">グリッドアイテム1</div>
  <div class="p-md">グリッドアイテム2</div>
  <div class="p-md">グリッドアイテム3</div>
</div>

<!-- カスタム値 -->
<div class="p-[25px] m-[1.5rem] gap-[calc(1rem+10px)]">カスタム値の使用例</div>

<!-- テーマカスタマイズ -->
<div class="p-custom gap-72">
  <div class="custom-flex">カスタムテーマの使用</div>
</div>
```

### React/Vue での使用例

```jsx
// React
function Component() {
  return (
    <div className="flex gap-md p-lg">
      <div className="p-sm hover:p-md transition-all">ホバーで拡大</div>
    </div>
  );
}
```

```vue
<!-- Vue -->
<template>
  <div class="grid gap-lg p-xl">
    <div class="p-md focus:p-lg" tabindex="0">フォーカスで拡大</div>
  </div>
</template>
```

## トラブルシューティング

### よくある問題

1. **クラスが適用されない**

   - `content` パターンにファイルが含まれているか確認
   - ブロックリストに含まれていないか確認

2. **本番で意図しないクラスが削除される**

   - セーフリストに追加
   - `showPurgeReport: true` でレポート確認

3. **ビルドが遅い**
   - 開発時は `purge.enabled: false` に設定
   - `content` パターンを最適化

## 開発

### ビルド

```bash
pnpm build
```

### テスト

```bash
pnpm test
```

### デバッグ

```bash
# パージレポートを有効にしてビルド
pnpm build --debug
```

## ライセンス

MIT
