# Smsshcss: PostCSS プラグイン設計

## 🎯 目的

ユーティリティクラスの大量記述を避け、コンポーネントクラスの導入と独自属性や構成ファイル（`smssh.config.ts`）に基づいてCSSを自動生成するPostCSSプラグインを作成します。

## ✅ 主な特徴

- コンポーネントセット:初心者でもすぐ使えるUIセットがある
- 上書き対応:柔軟なカスタマイズが可能
- 
- コンポーネント名で抽象化:クラス名を直接書かずに綺麗なコードにできる（例：`ui="card"`）
- ビルド時にクラス抽出:使われてるクラスだけをCSSに含められる

### 1. ui="..." 属性のパース

```html
<!-- HTML内 -->
<div ui="card" class='your-class'>
  <h1 ui="title">ようこそ</h1>
  <button ui="btn">登録</button>
</div>
```

- ui属性を見つけて該当するコンポーネントスタイルを展開

### 2. smsshcss.token.js でのデザイントークンの設定

```js
module.exports = {
  spacing: {
    sm: '0.5rem',
    md: '1rem',
    lg: '2rem',
  },
  colors: {
    white: '#fff',
    primary: '#0055ff',
    black: '#000',
  },
  borderRadius: {
    md: '0.5rem',
  },
  fontSize: {
    base: '1rem',
    xl: '2rem',
  },
};
```

### 3. smsshcss.config.js での設定

```js
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
  // デバッグモード (オプション)
  debug: false,

  // トークン設定の読み込み
  tokens,

  // コンポーネント定義
  components: {
    card: 'p-md bg-white rounded-md shadow',
    'button/primary': 'bg-primary text-white px-md py-sm rounded',
  },

  // ショートハンド
  shorthands: {
    btn: 'button/primary',
    title: 'heading/main',
  },

  // 任意属性設定（例: ui="card" → pre など文字列を変えたい場合）
  prefix: 'pre',
};
```

- `p-md` → `padding: 1rem;` に展開
- `bg-white` → `background-color: #fff;`
- ユーティリティ的な構文も tokens と組み合わせて変換


### 4. postcss.config.js でのPostCSSの設定

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

- HTMLに出現した s 属性・クラス名だけが解析対象
- 未使用の定義はビルドに含まれない（＝超軽量）

### 4. カスタム shorthand 対応

```js
shorthands: {
  btn: 'button/primary',
  title: 'heading/main'
}
```

- `ui="btn"` → `button/primary` として扱われる

## 🔧 ビルド時の流れ

1. HTML やテンプレートをスキャン（`ui="..."` を抽出）
2. `smsshcss.config.js` をパース
3. 抽出したスタイル名に対しユーティリティ or コンポーネント展開
4. 変換後の CSS を生成・出力

## 💡 将来的な拡張ポイント

- s 属性のスコープ解決（例：`ui="card lg"` → レスポンシブ対応）
- TypeScript で設定ファイルの型補完