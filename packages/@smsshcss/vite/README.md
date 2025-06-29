# @smsshcss/vite

> 🏗️ **Single Source of Truth アーキテクチャ** 対応

SmsshCSSのViteプラグイン。CSSユーティリティクラスを自動生成し、プロジェクトに統合します。コアパッケージとの統合設定システムにより、一貫性のある設定管理を実現。開発時は高速で、本番時はパージ機能により最適化されたCSSを提供します。

## ✨ 主要機能

- **🏗️ 統合設定システム**: コアパッケージから設定を自動取得、設定の重複を排除
- **🎯 Apply設定**: よく使うユーティリティクラスの組み合わせを定義可能
- **⚡ キャッシュ機能**: ファイル変更時のみ再生成、大幅なパフォーマンス向上
- **🔍 デバッグモード**: 詳細なログ出力で開発をサポート
- **🚀 最適化されたファイルスキャン**: 並列処理によるファイル処理の高速化
- **🔄 動的設定同期**: コア設定の変更が自動的にViteプラグインに反映

## 🏗️ Single Source of Truth 統合

このViteプラグインは、`smsshcss`コアパッケージとシームレスに統合され、**設定の重複を完全に排除**します：

### 自動設定同期

```typescript
// コアパッケージで設定を変更
// packages/smsshcss/src/config/spacingConfig.ts
export const defaultSpacingConfig = {
  md: '1.5rem', // 変更: 1.25rem → 1.5rem
  // ...
};

// Viteプラグインでは自動的に反映される（ハードコード不要）
// .m-md { margin: 1.5rem; } ← 自動的に更新
```

### 統合の利点

- **✅ 一元管理**: すべての設定値がコアパッケージで管理
- **✅ 自動同期**: コア設定の変更が即座に反映
- **✅ 型安全性**: TypeScriptによる設定値の型チェック
- **✅ ゼロ重複**: ハードコードされた設定値が存在しない

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
      includeResetCSS: true,
      includeBaseCSS: true,

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

      // Apply設定（よく使うユーティリティクラスの組み合わせを定義）
      // コア設定の値が自動的に適用されます
      apply: {
        'btn-primary': 'p-md bg-blue-500 text-white rounded hover:bg-blue-600',
        card: 'p-lg bg-white rounded-lg shadow-md',
        container: 'max-w-7xl mx-auto px-lg',
      },

      // パージレポートの表示
      showPurgeReport: true,

      // キャッシュ機能（v2.3.0+）
      cache: true,

      // デバッグモード（v2.3.0+）
      debug: process.env.NODE_ENV === 'development',
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
  includeResetCSS?: boolean;

  /**
   * ベースCSSを含めるかどうか
   * @default true
   */
  includeBaseCSS?: boolean;

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
   * Apply設定（よく使うユーティリティクラスの組み合わせを定義）
   */
  apply?: Record<string, string>;

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

  /**
   * キャッシュを有効にするかどうか
   * 開発時のパフォーマンス向上のため
   * @default true
   */
  cache?: boolean;

  /**
   * デバッグログを有効にするかどうか
   * 開発時のトラブルシューティングに有用
   * @default false
   */
  debug?: boolean;
}
```

## 💡 Apply設定

Apply設定を使用すると、よく使うユーティリティクラスの組み合わせを再利用可能なクラスとして定義できます：

```javascript
smsshcss({
  apply: {
    // ボタンのスタイル
    btn: 'p-md rounded cursor-pointer transition-all',
    'btn-primary': 'btn bg-blue-500 text-white hover:bg-blue-600',
    'btn-secondary': 'btn bg-gray-300 text-gray-700 hover:bg-gray-400',

    // カードコンポーネント
    card: 'p-lg bg-white rounded-lg shadow-md',
    'card-header': 'mb-md pb-md border-b',

    // レイアウト
    container: 'max-w-7xl mx-auto px-lg',
    'flex-center': 'flex items-center justify-center',
  },
});
```

**Apply設定の利点：**

- 🎨 **一貫性**: プロジェクト全体で統一されたスタイル

## 🎛️ コア設定との連携

### 自動設定取得

Viteプラグインは`smsshcss`コアパッケージの設定を自動的に取得し、すべてのユーティリティクラスを動的に生成します：

```typescript
// ❌ 従来の方法（重複・不整合の原因）
const viteConfig = {
  plugins: [
    smsshcss({
      // ハードコードされた設定（非推奨）
      customStyles: {
        '.m-md': 'margin: 1.25rem', // コア設定と重複
      },
    }),
  ],
};

// ✅ 現在の方法（Single Source of Truth）
const viteConfig = {
  plugins: [
    smsshcss({
      // コア設定から自動的に生成される
      // .m-md { margin: 1.25rem; } ← defaultSpacingConfig.mdから取得
      // .text-blue-500 { color: hsl(214 85% 55% / 1); } ← defaultColorConfig['blue-500']から取得
    }),
  ],
};
```

### カスタムテーマ設定

コアパッケージの設定を拡張する場合：

```typescript
// カスタム設定ファイル
// config/smsshcss.config.ts
import { defaultConfig } from 'smsshcss';

export const projectConfig = {
  ...defaultConfig,
  spacing: {
    ...defaultConfig.spacing,
    'brand-xs': '0.375rem',
    'brand-xl': '2.5rem',
  },
  color: {
    ...defaultConfig.color,
    'brand-primary': 'hsl(220 100% 50% / 1)',
    'brand-secondary': 'hsl(160 100% 45% / 1)',
  },
};

// vite.config.ts
import { defineConfig } from 'vite';
import smsshcss from '@smsshcss/vite';
import { projectConfig } from './config/smsshcss.config';

export default defineConfig({
  plugins: [
    smsshcss({
      // プロジェクト固有の設定を適用
      apply: {
        // カスタム設定を使用したクラス
        'project-btn': 'p-brand-xs bg-brand-primary text-white',
        'project-card': 'p-brand-xl bg-white border border-gray-200',
      },
    }),
  ],
});
```

### 動的設定の利点

```typescript
// コアパッケージで設定を更新
export const defaultSpacingConfig = {
  md: '1.5rem', // 1.25rem から変更
  // ...
};

// ↓ 自動的に以下のCSSが更新される
// .m-md { margin: 1.5rem; }     ← 自動更新
// .p-md { padding: 1.5rem; }    ← 自動更新
// .gap-md { gap: 1.5rem; }      ← 自動更新

// Apply設定も自動的に更新される
apply: {
  'card': 'p-md bg-white', // p-mdが1.5remで生成される
}
```

### 型安全な設定管理

```typescript
import type { DefaultConfig } from 'smsshcss';

// TypeScript支援による型安全な設定
// カスタム値は任意値記法で指定できます
// 例：m-[20px], bg-[#ff0000], text-[clamp(1rem,4vw,3rem)]

export default defineConfig({
  plugins: [
    smsshcss({
      // apply設定でカスタムクラスを定義
      apply: {
        'btn-custom': 'px-md py-sm bg-blue-500 text-white rounded',
        container: 'max-w-6xl mx-auto px-md',
      },
    }),
  ],
});
```

- ♻️ **再利用性**: よく使うパターンを簡単に再利用
- 📝 **可読性**: 意味のあるクラス名でコードが読みやすく
- 🚀 **効率性**: 複数のユーティリティクラスを1つのクラスで適用

## 🚀 パフォーマンス機能

### ⚡ キャッシュ機能（v2.3.0+）

自動的にファイルの変更を検知し、変更されたファイルのみを再処理します：

```javascript
smsshcss({
  // キャッシュを有効化（デフォルト）
  cache: true,

  // デバッグモードでキャッシュ状況を確認
  debug: true,
});
```

**キャッシュの利点：**

- 🔄 ファイル未変更時はキャッシュから高速取得
- 💾 メモリ効率的なハッシュベースキャッシュ
- 🧹 自動的な古いキャッシュの削除（10分ごと）
- 🎯 プロダクションビルド時の自動キャッシュリセット

### 🐛 デバッグモード（v2.3.0+）

詳細なログ出力で開発をサポート：

```javascript
smsshcss({
  debug: process.env.NODE_ENV === 'development',
});
```

**デバッグ出力例：**

```
[smsshcss] Configured for development mode
[smsshcss] Extracting custom classes from files...
[smsshcss] Extracted 42 unique custom classes
[smsshcss] Using cached CSS
[smsshcss] Generated CSS length: 15248 characters
```

### 🔧 最適化されたファイルスキャン

並列処理によるファイル処理の高速化：

- 📁 **並列glob処理**: 複数のファイルパターンを同時実行
- 🚀 **並列ファイル処理**: 全ファイルを同時に処理
- 📋 **統合されたカスタムクラス抽出**: 重複コードを削減
- 🎯 **正規表現の事前コンパイル**: パターンマッチングの高速化

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
// 開発時の推奨設定
smsshcss({
  cache: true, // キャッシュ有効
  debug: true, // デバッグ有効
  minify: false, // CSS圧縮無効（高速化）
  purge: {
    enabled: false, // パージ無効（高速化）
  },
});
```

### 🎯 本番時の最適化

```javascript
// 本番時の推奨設定
smsshcss({
  cache: false,    // キャッシュ無効（確実性重視）
  debug: false,    // デバッグ無効
  minify: true,    // CSS圧縮有効
  purge: {
    enabled: true, // パージ有効
    safelist: [...], // 必要なクラスを保護
  },
  showPurgeReport: true, // パージレポート表示
});
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

<!-- Apply設定の使用 -->
<div class="btn-primary">プライマリボタン</div>
<div class="card">カードコンポーネント</div>
<div class="container">コンテナ要素</div>
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
   - デバッグモードで詳細ログを確認

2. **本番で意図しないクラスが削除される**

   - セーフリストに追加
   - `showPurgeReport: true` でレポート確認

3. **ビルドが遅い**

   - `cache: true` でキャッシュを有効化
   - 開発時は `purge.enabled: false` に設定
   - `content` パターンを最適化

4. **キャッシュが効かない**
   - `debug: true` でキャッシュ状況を確認
   - ファイル権限をチェック
   - `cache: false` で一時的に無効化してテスト

### デバッグのヒント

```javascript
// デバッグモードで詳細情報を確認
smsshcss({
  debug: true,
  cache: true,
  showPurgeReport: true,
});
```

**デバッグ出力を確認：**

- ファイルスキャン状況
- キャッシュヒット/ミス
- 生成されたCSS量
- エラーの詳細情報

## 開発

### ビルド

```bash
pnpm build
yarn build
```

### テスト

```bash
pnpm test
yarn test
```

### デバッグ

```bash
# パージレポートを有効にしてビルド
pnpm build --debug
yarn build --debug
```

## ライセンス

MIT
