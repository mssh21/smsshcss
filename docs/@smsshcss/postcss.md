# SmsshCSS: PostCSS プラグイン設計

## 🎯 目的

ユーティリティクラスの大量記述を避け、コンポーネントクラスの導入と独自属性や構成ファイル（`smssh.config.js`/`smssh.token.js`）に基づいてCSSを自動生成するPostCSSプラグインを作成します。

## ✅ 主な特徴

- コンポーネントセットを提供
- スタイル上書きによる柔軟なカスタマイズが可能
- smsshcss.config.js / smsshcss.token.js による拡張性
- ユーティリティクラス自動生成（Spacing, Colorsなど）
- JIT（Just-In-Time）方式のCSS生成で爆速ビルド
- ビルド時にクラス抽出:使われてるクラスだけをCSSに含められる

### 1. smsshcss.token.jsでのデザイントークンの設定

```js
module.exports = {
  spacing: {
    base: 8;
  },
  colors: {
    primary: '#fff',
    secondary: '#0055ff',
    textPrimary: '#000',
  },
  borderRadius: {
    md: '0.5rem',
  },
  fontSize: {
    base: '14',
  },
};
```

### 2. smsshcss.config.js での設定

```js
// smsshcss.token.jsでカスタマイズした場合
const tokens = require('./smsshcss.token');

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
   // トークン設定の読み込み
  tokens,
  // 任意でクラス接頭語を設定可能
  prefix: '',
  // デバッグモード (オプション)
  debug: false,
};
```

- `p-md` → `padding: 1rem;` に展開
- `bg-white` → `background-color: #fff;`
- ユーティリティ的な構文も tokens と組み合わせて変換


### 4. postcss.config.jsでのPostCSSの設定

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

### 5. JIT(Just-In-Time)方式で必要なCSSだけを出力

- HTMLに出現したクラス名だけが解析対象
- 未使用の定義はビルドに含まれない（＝超軽量）


## 🔧 ビルド時の流れ

1. ソースをスキャン
2. `smsshcss.config.js` をパース
3. 抽出したスタイル名に対しユーティリティ or コンポーネント展開
4. 変換後のCSS を生成・出力
