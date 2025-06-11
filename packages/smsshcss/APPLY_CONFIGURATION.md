# SmsshCSS Apply設定ガイド

SmsshCSSでは、よく使うユーティリティクラスの組み合わせを`apply`設定で定義し、再利用可能なコンポーネントクラスを作成できます。

## 基本的な考え方

Apply設定により、複数のユーティリティクラスを1つのクラス名にまとめることができます。これはTailwind CSSの`@apply`ディレクティブに似た機能ですが、設定ファイルで直接定義できる点が特徴です。

```javascript
// ✅ Apply設定（SmsshCSSの推奨アプローチ）
apply: {
  'main-layout': 'w-lg mx-auto px-lg block',
  'flex-center': 'flex justify-center items-center'
}
```

## Apply設定の使い方

### 基本的な設定例

```javascript
module.exports = {
  content: ['src/**/*.{html,js,ts,jsx,tsx,vue,svelte}'],

  apply: {
    // レイアウト系
    'main-layout': 'w-lg mx-auto px-lg block',
    container: 'w-full max-w-[1200px] mx-auto px-sm',

    // フレックスボックスのパターン
    'flex-center': 'flex justify-center items-center',
    'flex-between': 'flex justify-between items-center',

    // カード系コンポーネント
    card: 'p-md',
    'card-header': 'pb-sm mb-sm',
    'card-body': 'py-sm',
    'card-footer': 'pt-sm mt-sm',

    // ボタン系
    btn: 'inline-block px-md py-sm',
    'btn-primary': 'btn',
    'btn-secondary': 'btn',
  },
};
```

### HTML内での使用

```html
<!-- Apply設定で定義したクラスを使用 -->
<div class="main-layout">
  <div class="card">
    <div class="card-header">
      <h2>カードタイトル</h2>
    </div>
    <div class="card-body">
      <p>カードの内容</p>
    </div>
    <div class="card-footer">
      <button class="btn-primary">アクション</button>
    </div>
  </div>
</div>

<!-- 生成されるスタイルは、定義したユーティリティクラスの組み合わせ -->
```

## カスタム値の使用

ユーティリティクラスのカスタマイズが必要な場合は、カスタムプロパティ（CSS変数）または任意値記法を使用します。

### CSS変数を使用したカスタマイズ

```css
:root {
  --sidebar-width: 280px;
  --header-height: 64px;
  --custom-spacing: 1.5rem;
}
```

```html
<!-- CSS変数を使用 -->
<div class="w-[var(--sidebar-width)] h-[var(--header-height)]">
  <div class="p-[var(--custom-spacing)]">コンテンツ</div>
</div>
```

### 任意値記法

```html
<!-- 直接値を指定 -->
<div class="w-[280px] h-[64px] p-[1.5rem]">
  <div class="m-[20px] gap-[30px]">カスタム値を使用したレイアウト</div>
</div>

<!-- 計算式も使用可能 -->
<div class="h-[calc(100vh-64px)] w-[calc(100%-280px)]">メインコンテンツエリア</div>
```

## 実践的な設定例

### 企業サイト向け

```javascript
apply: {
  // レイアウト
  'main-container': 'w-full max-w-[1200px] mx-auto px-md lg:px-lg',
  'hero-section': 'py-3xl lg:py-4xl',
  'content-section': 'py-2xl',

  // ナビゲーション
  'nav-link': 'px-md py-sm inline-block',
  'nav-active': 'nav-link',

  // カード
  'feature-card': 'p-lg',
  'testimonial-card': 'p-xl',

  // ボタン
  'btn-base': 'inline-block px-lg py-md',
  'btn-cta': 'btn-base',
}
```

### ダッシュボード向け

```javascript
apply: {
  // レイアウト
  'dashboard-layout': 'flex h-screen',
  'sidebar': 'w-[280px] h-full',
  'main-content': 'flex-1 p-lg',

  // パネル
  'panel': 'p-md',
  'panel-header': 'pb-sm mb-sm',
  'panel-body': 'py-sm',

  // データ表示
  'stat-card': 'p-lg',
  'data-table': 'w-full',
}
```

### モバイルアプリ向け

```javascript
apply: {
  // レイアウト
  'mobile-container': 'w-full h-screen flex flex-col',
  'mobile-header': 'h-[56px] px-md flex items-center',
  'mobile-content': 'flex-1 px-md py-md',
  'mobile-footer': 'h-[48px]',

  // タッチ要素
  'touch-target': 'min-h-[44px] flex items-center',
  'list-item': 'py-md px-md touch-target',

  // ボタン
  'mobile-btn': 'w-full py-md',
}
```

## ベストプラクティス

### 1. 命名規則の統一

```javascript
// ✅ 良い例：一貫した命名
apply: {
  'card': 'p-md',
  'card-header': 'pb-sm mb-sm',
  'card-body': 'py-sm',
  'card-footer': 'pt-sm mt-sm',
}

// ❌ 悪い例：命名がバラバラ
apply: {
  'Card': 'p-md',
  'cardHeader': 'pb-sm mb-sm',
  'card_body': 'py-sm',
  'CardFooter': 'pt-sm mt-sm',
}
```

### 2. 単一責任の原則

```javascript
// ✅ 良い例：各クラスが明確な責任を持つ
apply: {
  'flex-center': 'flex justify-center items-center',
  'text-center': 'text-center',
  'full-width': 'w-full',
}

// ❌ 悪い例：1つのクラスに多くの責任
apply: {
  'super-component': 'flex justify-center items-center w-full h-full p-lg m-lg text-center',
}
```

### 3. 再利用性を考慮

```javascript
// ✅ 良い例：基本クラスを拡張
apply: {
  'btn': 'inline-block px-md py-sm',
  'btn-primary': 'btn',
  'btn-secondary': 'btn',
  'btn-large': 'btn px-lg py-md',
}
```

## 移行ガイド

### 以前のtheme設定からの移行

以前のバージョンでtheme設定を使用していた場合、カスタム値は以下の方法で実現できます：

#### Before (theme設定)

```javascript
theme: {
  spacing: {
    'sidebar': '280px',
    'header': '64px',
  }
}
```

#### After (CSS変数 + 任意値)

```css
:root {
  --sidebar-width: 280px;
  --header-height: 64px;
}
```

```html
<div class="w-[var(--sidebar-width)] h-[var(--header-height)]">
  <!-- または直接値を使用 -->
  <div class="w-[280px] h-[64px]"></div>
</div>
```

## まとめ

- Apply設定により、ユーティリティクラスの組み合わせを再利用可能にできます
- カスタム値はCSS変数または任意値記法で実現できます
- 一貫した命名規則と単一責任の原則を守ることで、保守性の高いコードを書けます
- 既存のtheme設定からの移行は、CSS変数を使用することでスムーズに行えます
