# SmsshCSS: フレームワークガイド

SmsshCSSは、ユーティリティクラスの大量記述を避け、コンポーネントクラスの導入と独自属性や構成ファイル（`smsshcss.config.js`または`smsshcss.config.cjs`）に基づいてCSSを自動生成するフレームワークです。

## 🚨 重要なお知らせ

**パッケージ名の変更について**

バージョン2.0.0から、パッケージ名がより明確なスコープ管理のため変更されました：

- `smsshcss-postcss` → `@smsshcss/postcss`
- `smsshcss-vite` → `@smsshcss/vite`

既存プロジェクトを移行する際は、以下の変更が必要です：

```bash
# 古いパッケージをアンインストール
## npm
npm uninstall smsshcss-postcss smsshcss-vite
## yarn
yarn remove smsshcss-postcss smsshcss-vite

# 新しいパッケージをインストール
## npm
npm install @smsshcss/postcss @smsshcss/vite
## yarn
yarn add @smsshcss/postcss @smsshcss/vite
```

また、設定ファイル内の参照も更新してください：

```js
// postcss.config.js (変更前)
require('smsshcss-postcss')();

// postcss.config.js (変更後)
require('@smsshcss/postcss')();

// vite.config.js (変更前)
import smsshcssPlugin from 'smsshcss-vite';

// vite.config.js (変更後)
import smsshcssPlugin from '@smsshcss/vite';
```

## 🌟 インストール

### PostCSSプラグインとして使用

```bash
# npm
npm i smsshcss @smsshcss/postcss postcss

# yarn
yarn add smsshcss @smsshcss/postcss postcss
```

### Viteプラグインとして使用

```bash
# npm
npm i smsshcss @smsshcss/vite

# yarn
yarn add smsshcss @smsshcss/vite
```

## 🎯 目的

ユーティリティクラスの大量記述を避け、コンポーネントクラスの導入と独自属性や構成ファイルに基づいてCSSを自動生成するフレームワークを提供します。

## ✅ 主な特徴

- コンポーネントセットを提供
- スタイル上書きによる柔軟なカスタマイズが可能
- テーマ設定による拡張性
- ユーティリティクラス自動生成（Spacing, Colorsなど）
- JIT（Just-In-Time）方式のCSS生成で爆速ビルド
- ビルド時にクラス抽出:使われてるクラスだけをCSSに含められる

## 📝 使用方法

### 1. 設定ファイルの初期化

以下のコマンドで設定ファイルを初期化します：

```bash
npx smsshcss init
```

これにより、プロジェクトルートに `smsshcss.config.js` ファイルが作成されます。

### 2. テーマ設定ファイルの作成方法

```js
// smsshcss.config.js - 複数プロジェクト間で共有するテーマ設定
export const smsshcssTheme = {
  // スキャン対象のファイル
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // 常に含めるクラス
  safelist: [],
  // reset.cssを含めるかどうか (デフォルトはtrue)
  includeResetCSS: true,
  // base.cssを含めるかどうか (デフォルトはtrue)
  includeBaseCSS: true,
  // レガシーモードを無効化（@importが不要になります）
  legacyMode: false,
  // デバッグモード (オプション)
  debug: false,

  // テーマ設定 - トークンのカスタマイズ
  theme: {
    // カラーのカスタマイズ
    colors: {
      primary: '#3366FF',
      textPrimary: '#333333',
      backgroundBase: '#FFFFFF',
    },
    // フォントウェイトのカスタマイズ
    fontWeight: {
      normal: '400',
      bold: '700',
    },
    // フォントサイズのカスタマイズ
    fontSize: {
      base: '16px',
      xl: '24px',
      '2xl': '30px',
    },
    // 行の高さのカスタマイズ
    lineHeight: {
      normal: '1.5',
      relaxed: '1.75',
    },
    // スペーシングのカスタマイズ
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
    },
    // ボーダー半径のカスタマイズ
    borderRadius: {
      sm: '4px',
      md: '8px',
      lg: '12px',
    },
    // シャドウのカスタマイズ
    shadow: {
      sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
  },
};
```

この設定によりユーティリティクラスが変換されます：

- `p-md` → `padding: 16px;` に展開
- `bg-primary` → `background-color: #3366FF;` に展開
- その他、トークンと組み合わせたユーティリティクラスが自動的に変換されます

### 3. プラグインの設定

#### PostCSSプラグインとして使用する場合

```js
// postcss.config.js
module.exports = {
  plugins: [
    // @smsshcss/postcssプラグインを使用
    require('@smsshcss/postcss')(),
  ],
};
```

#### Viteプラグインとして使用する場合（2つのアプローチ）

共有テーマモジュールを使用（推奨）

```js
// vite.config.js
import { defineConfig } from 'vite';
import smsshcss from '@smsshcss/vite';
import { smsshcssTheme } from './smsshcss.config.js'; // 共有テーマをインポート

export default defineConfig({
  plugins: [
    smsshcss({
      smsshcssTheme,
    }),
  ],
});
```

### 4. CSSディレクティブの使用

CSSファイル内で以下のSMSSHCSSディレクティブを使用して、生成されたスタイルをインポートできます：

```css
/* リセットとベーススタイルをインポート */
@smsshcss base;

/* すべてのユーティリティクラスをインポート */
@smsshcss utilities;

/* 上記を1つのディレクティブでまとめてインポート */
@smsshcss;

/* 以降はカスタムCSSを記述 */
body {
  /* ... */
}
```

これらのディレクティブはビルド時に、設定ファイルの内容またはプラグインオプションに基づいて展開されます。

## ⚡ JIT(Just-In-Time)方式の動作

SmsshCSSは、Just-In-Time方式でCSSを生成します：

- HTMLに出現したクラス名だけが解析対象となります
- 未使用の定義はビルドに含まれないため、最終的なCSSは非常に軽量です
- 開発環境では変更を検出して必要なCSSを動的に再生成します

## 🔧 ビルド時の流れ

1. 設定された`content`パスのソースファイルをスキャン
2. テーマ設定を解析（プラグインオプションまたは設定ファイル）
3. 抽出したクラス名に対しユーティリティまたはコンポーネントのCSSを展開
4. 変換後のCSSを生成・出力

## 🌈 カスタムコンポーネント対応

独自のコンポーネントスタイルも簡単に定義することができます。詳細についてはドキュメントをご参照ください。

## 📋 設定ファイルのオプション

| オプション        | 型         | デフォルト値                                     | 説明                                                   |
| ----------------- | ---------- | ------------------------------------------------ | ------------------------------------------------------ |
| `content`         | `string[]` | `['./src/**/*.{html,js,jsx,ts,tsx,vue,svelte}']` | クラス名をスキャンするファイルのパターン               |
| `safelist`        | `string[]` | `[]`                                             | 常に出力に含めるクラス名                               |
| `includeResetCSS` | `boolean`  | `true`                                           | 組み込みのreset.cssを含めるかどうか                    |
| `includeBaseCSS`  | `boolean`  | `true`                                           | 組み込みのbase.cssを含めるかどうか                     |
| `legacyMode`      | `boolean`  | `false`                                          | レガシーモードの有効化/無効化                          |
| `debug`           | `boolean`  | `false`                                          | デバッグログの有効化                                   |
| `outputFile`      | `string`   | `'smsshcss.css'`                                 | 出力するCSSファイル名                                  |
| `customCSS`       | `string`   | `''`                                             | 末尾に追加するカスタムCSS                              |
| `configFile`      | `string`   | `'smsshcss.config.js'`                           | 設定ファイルのパス（プロジェクトルートからの相対パス） |
| `theme`           | `object`   | `{}`                                             | カラー、スペーシングなどのテーマカスタマイズオプション |
