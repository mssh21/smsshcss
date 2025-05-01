# SmsshCSS - 軽量ユーティリティファーストCSSフレームワーク

SmsshCSSは、軽量なユーティリティファーストCSSフレームワークです。HTMLファイル内で使用されるクラスのみを生成し、最適化されたCSSを提供します。

## 特徴

- **ユーティリティファースト**: 再利用可能なユーティリティクラスを使用してUIを素早く構築
- **パージ機能**: HTMLで使用されたクラスのみを含む最適化されたCSSを生成
- **カスタマイズ可能**: 設定ファイルを通じてトークンやスタイルをカスタマイズ可能
- **高速**: 最小限のCSSでパフォーマンスを最適化
- **多様な統合**: PostCSSプラグインとViteプラグインの両方をサポート

## インストール

### PostCSSプラグインとして使用する場合

```bash
# npm
npm install smsshcss @smsshcss/postcss postcss

# yarn
yarn add smsshcss @smsshcss/postcss postcss
```

### Viteプラグインとして使用する場合

```bash
# npm
npm install smsshcss @smsshcss/vite

# yarn
yarn add smsshcss @smsshcss/vite
```

## 使用方法

### 1. テーマ設定ファイルの作成

テーマを設定する方法には主に2つのアプローチがあります：

#### A. 共有テーマモジュールの作成（推奨）

複数のプロジェクト間でテーマ設定を共有する場合は、専用の共有テーマモジュールを作成する方法が推奨されます：

```js
// shared-theme.js - 複数プロジェクト間で共有するテーマ設定
export const sharedTheme = {
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
  // その他のテーマ設定...
  lineHeight: {
    normal: '1.5',
    relaxed: '1.75',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
  shadow: {
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
};
```

#### B. プロジェクトごとの設定ファイル

各プロジェクトで設定を分離したい場合は、従来の設定ファイルアプローチを使用できます：

```js
// smsshcss.config.js または smsshcss.config.cjs
module.exports = {
  // スキャン対象のファイル
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  // 常に含めるクラス
  safelist: [
    'flex', 'items-center', 'justify-between'
  ],
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
      backgroundBase: '#FFFFFF'
    },
    // フォントウェイトのカスタマイズ
    fontWeight: {
      normal: '400',
      bold: '700'
    },
    // フォントサイズのカスタマイズ
    fontSize: {
      base: '16px',
      xl: '24px',
      '2xl': '30px'
    },
    // 行の高さのカスタマイズ
    lineHeight: {
      normal: '1.5',
      relaxed: '1.75'
    },
    // スペーシングのカスタマイズ
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px'
    },
    // ボーダー半径のカスタマイズ
    borderRadius: {
      sm: '4px',
      md: '8px',
      lg: '12px'
    },
    // シャドウのカスタマイズ
    shadow: {
      sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }
  }
};
```

### 2. プラグインの設定

#### PostCSSプラグインとして使用する場合

`postcss.config.js`ファイルを作成し、以下のように設定します:

```js
// 方法1: 標準設定ファイルを使用
module.exports = {
  plugins: [
    require('@smsshcss/postcss')(),
    // その他のプラグイン
    require('autoprefixer')
  ]
};

// 方法2: 共有テーマモジュールを使用
const { sharedTheme } = require('./path/to/shared-theme.js');

module.exports = {
  plugins: [
    require('@smsshcss/postcss')({
      theme: sharedTheme,
      // その他のオプション
    }),
    require('autoprefixer')
  ]
};
```

#### Viteプラグインとして使用する場合

`vite.config.js`ファイルで以下のように設定します:

```js
// 方法1: 共有テーマモジュールを使用（推奨）
import { defineConfig } from 'vite';
import smsshcss from '@smsshcss/vite';
import { sharedTheme } from './path/to/shared-theme.js';

export default defineConfig({
  plugins: [
    smsshcss({
      content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
      theme: sharedTheme,
      // その他のオプション
    }),
  ],
});

// 方法2: 直接テーマを定義
import { defineConfig } from 'vite';
import smsshcss from '@smsshcss/vite';

const theme = {
  colors: {
    primary: '#3366FF',
    // その他のカラー設定...
  },
  // その他のテーマ設定...
};

export default defineConfig({
  plugins: [
    smsshcss({
      content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
      theme: theme,
    }),
  ],
});

// 方法3: 設定ファイルを使用
import { defineConfig } from 'vite';
import smsshcss from '@smsshcss/vite';

export default defineConfig({
  plugins: [
    smsshcss({
      configFile: 'smsshcss.config.js', // ESM形式が推奨
    }),
  ],
});
```

**注意**: Viteプラグインを使用する場合、現時点ではCJS形式の設定ファイルの読み込みに制限があります。ESM形式の設定ファイルを使用するか、共有テーマモジュールまたはvite.configでの直接定義をお勧めします。

### 3. CSSディレクティブの使用

CSSファイルでSmsshCSSディレクティブを使用します:

```css
/* リセットとベーススタイルをインポート */
@smsshcss base;

/* すべてのユーティリティクラスをインポート */
@smsshcss utilities;

/* または、1つのディレクティブで両方をインポート */
@smsshcss;

/* カスタムCSSをここに追加 */
.custom-container {
  max-width: 1200px;
  margin: 0 auto;
}
```

### 4. HTMLでの使用

設定したユーティリティクラスをHTMLで使用します:

```html
<div class="flex items-center justify-between">
  <h1 class="text-2xl font-bold text-primary">Hello, SmsshCSS!</h1>
  <button class="bg-primary text-white p-md rounded-sm">Click me</button>
</div>
```

## 複数プロジェクト間でのテーマ共有のベストプラクティス

ViteプロジェクトとPostCSSプロジェクト間で一貫したテーマを共有するには、共有テーマモジュールを作成して両方のプラグインで使用することをお勧めします：

```
project-root/
├── shared/
│   └── theme.js        # 共有テーマモジュール
├── vite-project/
│   ├── vite.config.js  # 共有テーマをインポート
│   └── ...
└── postcss-project/
    ├── postcss.config.js  # 同じ共有テーマをインポート
    └── ...
```

この方法により、すべてのプロジェクトで一貫したデザイントークンを維持できます。

## 設定オプション

### 主要なオプション

| オプション | 説明 | デフォルト値 |
|------------|------|------------|
| `content` | クラス名を抽出するファイルのパターン | `['./src/**/*.{html,js,jsx,ts,tsx,vue,svelte}']` |
| `safelist` | 常に含めるクラス名 | `[]` |
| `includeResetCSS` | reset.cssを含めるかどうか | `true` |
| `includeBaseCSS` | base.cssを含めるかどうか | `true` |
| `legacyMode` | @import "smsshcss"を使うレガシーモード | `false` |
| `debug` | デバッグ情報を出力 | `false` |
| `outputFile` | 出力するCSSファイル名 | `smsshcss.css` |
| `customCSS` | 末尾に追加するカスタムCSS | `''` |
| `configFile` | 設定ファイルのパス | `'smsshcss.config.js'` |
| `theme` | テーマ設定オブジェクト | `{}` |

### カスタマイズ可能なトークン

| カテゴリ | 説明 | 例 |
|---------|------|-----|
| `colors` | カラートークン | `primary`, `textPrimary`, `backgroundBase` |
| `fontSize` | フォントサイズトークン | `base`, `xl`, `2xl` |
| `fontWeight` | フォントウェイトトークン | `normal`, `bold` |
| `lineHeight` | 行の高さトークン | `normal`, `relaxed` |
| `spacing` | スペーシングトークン | `xs`, `sm`, `md` |
| `borderRadius` | 角丸トークン | `sm`, `md`, `lg` |
| `shadow` | シャドウトークン | `sm`, `md` |

## 応用例

### ダークモード対応

```js
// shared-theme.js
export const sharedTheme = {
  colors: {
    // ライトモード
    primary: '#3366FF',
    textPrimary: '#333333',
    backgroundBase: '#FFFFFF',
    
    // ダークモード用（カスタムCSSと併用）
    primaryDark: '#668CFF',
    textPrimaryDark: '#EEEEEE',
    backgroundBaseDark: '#121212'
  }
  // 他のテーマ設定...
};
```

```css
/* styles.css */
@media (prefers-color-scheme: dark) {
  body {
    color: var(--text-primary-dark);
    background-color: var(--background-base-dark);
  }
  
  .text-primary {
    color: var(--primary-dark);
  }
}
```

## 開発

### パッケージ構成

- `smsshcss`: コアライブラリ (ユーティリティ定義とトークン)
- `@smsshcss/postcss`: PostCSSプラグイン (クラス抽出とCSSの生成)
- `@smsshcss/vite`: Viteプラグイン (Viteプロジェクト向け統合)

### 開発用コマンド

```bash
# 依存関係のインストール
yarn

# ビルド
yarn build

# PostCSSプレイグラウンドでのテスト
cd playground/@smsshcss/postcss-playground
yarn build
yarn serve

# Viteプレイグラウンドでのテスト
cd playground/@smsshcss/vite-playground
yarn dev
```

## 詳細ドキュメント

より詳細な使用方法やカスタマイズオプションについては、[ドキュメント](./docs/smsshcss.md)を参照してください。

## ライセンス

MIT
