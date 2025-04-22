# smsshcss 設定ファイルの使用方法

## 新機能 1: smsshcss.config.js

このアップデートでは、`smsshcss.config.js` ファイルを使用して smsshcss の設定を定義できるようになりました。これにより、PostCSS の設定ファイルとは別に smsshcss 固有の設定を管理できます。

### 使用方法

1. プロジェクトのルートディレクトリに `smsshcss.config.js` ファイルを作成します。

```js
/**
 * smsshcss 設定ファイル
 */
module.exports = {
  // スキャン対象のファイル
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  // 常に含めるクラス
  safelist: [
    'flex', 'items-center', 'justify-between', 'grow'
  ],
  // デバッグモード (オプション)
  debug: false
};
```

2. postcss.config.js を簡素化します。

```js
/**
 * PostCSS 設定ファイル
 */
module.exports = {
  plugins: [
    // @smsshcss/postcssプラグインを使用
    require('@smsshcss/postcss')(),
    
    // 他のプラグイン
    require('autoprefixer')
  ]
};
```

3. (オプション) 特定の設定ファイルを指定したい場合は、以下のように設定できます。

```js
require('@smsshcss/postcss')({
  configFile: './path/to/smsshcss.config.js'
})
```

## 新機能 2: @importなしの自動生成モード

従来は `@import "smsshcss";` の記述が必要でしたが、このアップデートでは自動的にCSSを生成できるようになりました。

### 使用方法

1. smsshcss.config.js で legacyMode を false に設定します。

```js
module.exports = {
  // ...他の設定...
  
  // レガシーモードを無効化（@importが不要になります）
  legacyMode: false
};
```

2. CSSファイルから `@import "smsshcss";` の記述を削除できます。

**変更前:**
```css
/* smsshcssユーティリティクラスのインポート */
@import "smsshcss";

/* 他のスタイル */
body { /* ... */ }
```

**変更後:**
```css
/* smsshcssユーティリティクラスは自動的に追加されます */

/* 他のスタイル */
body { /* ... */ }
```

### 設定の優先順位

1. postcss.config.js 内の直接指定された設定
2. smsshcss.config.js 内の設定
3. デフォルト値

### サポートされている設定ファイル形式

- `smsshcss.config.js` (CommonJS)
- `smsshcss.config.cjs` (CommonJS)
- `smsshcss.config.mjs` (ES Modules) 