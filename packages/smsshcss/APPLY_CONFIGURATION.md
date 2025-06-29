# SmsshCSS Apply設定ガイド

SmsshCSSでは、よく使うユーティリティクラスの組み合わせを`apply`設定で定義し、再利用可能なコンポーネントクラスを作成できます。

## 🎯 基本的な考え方

Apply設定により、複数のユーティリティクラスを1つのクラス名にまとめることができます。これはTailwind CSSの`@apply`ディレクティブに似た機能ですが、設定ファイルで直接定義できる点が特徴です。

### SmsshCSSの独自アプローチ

```javascript
// ✅ Apply設定（SmsshCSSの推奨アプローチ）
apply: {
  'main-layout': 'w-full max-w-6xl mx-auto px-md',
  'flex-center': 'flex justify-center items-center',
  'card': 'p-md rounded-lg border border-gray-200',
  'btn-primary': 'inline-block px-md py-sm rounded bg-blue-500 text-white hover:bg-blue-600'
}
```

### 従来のCSS-in-JSとの比較

```javascript
// ❌ 従来のCSS-in-JS（複雑で保守性が低い）
const styles = {
  mainLayout: {
    width: '100%',
    maxWidth: '1152px',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: '1.25rem',
    paddingRight: '1.25rem'
  }
};

// ✅ SmsshCSS Apply設定（シンプルで保守性が高い）
apply: {
  'main-layout': 'w-full max-w-6xl mx-auto px-md'
}
```

## ⚙️ Apply設定の使い方

### 基本的な設定例

```javascript
// vite.config.js または smsshcss.config.js
module.exports = {
  content: ['src/**/*.{html,js,ts,jsx,tsx,vue,svelte}'],

  apply: {
    // 🏗️ レイアウト系
    'main-layout': 'w-full max-w-6xl mx-auto px-md',
    container: 'w-full max-w-4xl mx-auto px-md',
    section: 'py-xl',
    wrapper: 'min-h-screen bg-gray-50',

    // 🎯 フレックスボックスのパターン
    'flex-center': 'flex justify-center items-center',
    'flex-between': 'flex justify-between items-center',
    'flex-start': 'flex justify-start items-center',
    'flex-col-center': 'flex flex-col justify-center items-center',

    // 🃏 カード系コンポーネント
    card: 'p-md rounded-lg border border-gray-200 bg-white shadow-sm',
    'card-header': 'pb-sm mb-sm border-b border-gray-100',
    'card-body': 'py-sm',
    'card-footer': 'pt-sm mt-sm border-t border-gray-100',

    // 🔘 ボタン系
    btn: 'inline-block px-md py-sm rounded cursor-pointer transition-colors',
    'btn-primary': 'btn bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-200',
    'btn-secondary':
      'btn bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-2 focus:ring-gray-200',
    'btn-danger': 'btn bg-red-500 text-white hover:bg-red-600 focus:ring-2 focus:ring-red-200',

    // 📝 フォーム系
    input:
      'w-full px-sm py-xs border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-200',
    label: 'block text-sm font-medium text-gray-700 mb-xs',
    'form-group': 'mb-md',

    // 🎨 装飾的要素
    badge: 'inline-block px-xs py-2xs text-xs font-medium rounded-full',
    'badge-primary': 'badge bg-blue-100 text-blue-800',
    'badge-success': 'badge bg-green-100 text-green-800',
    'badge-warning': 'badge bg-yellow-100 text-yellow-800',
    'badge-danger': 'badge bg-red-100 text-red-800',
  },
};
```

### HTML内での使用

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>SmsshCSS Apply設定例</title>
  </head>
  <body class="wrapper">
    <!-- Apply設定で定義したクラスを使用 -->
    <div class="main-layout">
      <!-- ヘッダー -->
      <header class="flex-between py-lg">
        <h1 class="text-2xl font-bold">SmsshCSS</h1>
        <nav class="flex gap-md">
          <a href="#" class="btn-secondary">ドキュメント</a>
          <a href="#" class="btn-primary">開始する</a>
        </nav>
      </header>

      <!-- メインコンテンツ -->
      <main class="section">
        <!-- ヒーローセクション -->
        <section class="flex-col-center text-center py-2xl">
          <h2 class="text-4xl font-bold mb-lg">Apply設定の活用</h2>
          <p class="text-lg text-gray-600 mb-xl">再利用可能なコンポーネントクラス</p>
          <div class="flex gap-md">
            <button class="btn-primary">メインアクション</button>
            <button class="btn-secondary">サブアクション</button>
          </div>
        </section>

        <!-- カードセクション -->
        <section class="container">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            <!-- カード1 -->
            <div class="card">
              <div class="card-header">
                <h3 class="text-xl font-semibold">パフォーマンス</h3>
                <span class="badge-primary">高速</span>
              </div>
              <div class="card-body">
                <p>JIT生成とキャッシュシステムで高速処理</p>
              </div>
              <div class="card-footer">
                <button class="btn-primary w-full">詳細を見る</button>
              </div>
            </div>

            <!-- カード2 -->
            <div class="card">
              <div class="card-header">
                <h3 class="text-xl font-semibold">型安全性</h3>
                <span class="badge-success">安全</span>
              </div>
              <div class="card-body">
                <p>TypeScriptによる完全な型サポート</p>
              </div>
              <div class="card-footer">
                <button class="btn-secondary w-full">詳細を見る</button>
              </div>
            </div>

            <!-- カード3 -->
            <div class="card">
              <div class="card-header">
                <h3 class="text-xl font-semibold">最適化</h3>
                <span class="badge-warning">効率的</span>
              </div>
              <div class="card-body">
                <p>使用されたクラスのみを含む最小限のCSS</p>
              </div>
              <div class="card-footer">
                <button class="btn-danger w-full">詳細を見る</button>
              </div>
            </div>
          </div>
        </section>

        <!-- フォームセクション -->
        <section class="container py-xl">
          <div class="card max-w-md mx-auto">
            <div class="card-header">
              <h3 class="text-xl font-semibold">お問い合わせ</h3>
            </div>
            <div class="card-body">
              <form>
                <div class="form-group">
                  <label class="label">お名前</label>
                  <input type="text" class="input" placeholder="山田太郎" />
                </div>
                <div class="form-group">
                  <label class="label">メールアドレス</label>
                  <input type="email" class="input" placeholder="example@email.com" />
                </div>
                <div class="form-group">
                  <label class="label">メッセージ</label>
                  <textarea class="input h-24" placeholder="お問い合わせ内容"></textarea>
                </div>
                <button type="submit" class="btn-primary w-full">送信する</button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <!-- フッター -->
      <footer class="py-lg border-t text-center text-gray-600">
        <p>&copy; 2024 SmsshCSS. MIT License.</p>
      </footer>
    </div>
  </body>
</html>
```

このHTMLでは、Apply設定で定義したクラスを活用して、保守性の高いマークアップを実現しています。

## 🎨 カスタム値とCSS関数の活用

Apply設定では、SmsshCSSの強力なCSS関数サポートを活用できます。

### CSS変数を使用したカスタマイズ

```css
:root {
  --sidebar-width: 280px;
  --header-height: 64px;
  --custom-spacing: 1.5rem;
  --brand-color: #3b82f6;
  --border-radius: 0.5rem;
}
```

```javascript
apply: {
  // CSS変数を活用したApply設定
  'sidebar': 'w-[var(--sidebar-width)] h-full bg-white border-r',
  'header': 'h-[var(--header-height)] flex-between px-md bg-white shadow-sm',
  'brand-button': 'btn bg-[var(--brand-color)] text-white hover:bg-[var(--brand-color)]/90',
  'custom-card': 'p-[var(--custom-spacing)] rounded-[var(--border-radius)] border',
}
```

### レスポンシブなApply設定

```javascript
apply: {
  // レスポンシブスペーシング
  'responsive-container': 'w-full px-[clamp(1rem,4vw,3rem)] mx-auto',
  'responsive-padding': 'p-[clamp(0.5rem,2vw,2rem)]',
  'responsive-gap': 'gap-[clamp(1rem,3vw,2rem)]',

  // 動的な高さ計算
  'full-height-minus-header': 'h-[calc(100vh-64px)]',
  'sidebar-content': 'h-[calc(100vh-var(--header-height))]',

  // 複雑なレスポンシブレイアウト
  'grid-responsive': 'grid grid-cols-1 md:grid-cols-[280px_1fr] gap-[min(2rem,4vw)]',
  'fluid-typography': 'text-[clamp(1rem,2.5vw,1.5rem)] leading-[1.4]',
}
```

### 任意値記法の活用

```html
<!-- Apply設定で定義したレスポンシブクラスを使用 -->
<div class="responsive-container">
  <!-- レスポンシブグリッド -->
  <div class="grid-responsive">
    <!-- サイドバー -->
    <aside class="sidebar-content bg-gray-50 p-md">
      <nav class="space-y-sm">
        <a href="#" class="block p-xs rounded hover:bg-gray-200">ダッシュボード</a>
        <a href="#" class="block p-xs rounded hover:bg-gray-200">プロフィール</a>
        <a href="#" class="block p-xs rounded hover:bg-gray-200">設定</a>
      </nav>
    </aside>

    <!-- メインコンテンツ -->
    <main class="responsive-padding">
      <h1 class="fluid-typography font-bold mb-lg">レスポンシブレイアウト</h1>

      <!-- レスポンシブカード -->
      <div class="grid gap-[clamp(1rem,3vw,2rem)] grid-cols-1 lg:grid-cols-2">
        <div class="custom-card">
          <h3 class="text-lg font-semibold mb-sm">カード1</h3>
          <p>レスポンシブなパディングとギャップ</p>
        </div>
        <div class="custom-card">
          <h3 class="text-lg font-semibold mb-sm">カード2</h3>
          <p>CSS関数を活用した動的レイアウト</p>
        </div>
      </div>
    </main>
  </div>
</div>
```

## 📋 実践的な設定例

### 企業サイト向け設定

```javascript
apply: {
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
  // 📱 レスポンシブ対応
  'hero-section': 'py-[clamp(2rem,8vw,6rem)] px-[clamp(1rem,4vw,3rem)]',
  'company-header': 'h-16 flex-between px-xl bg-white shadow-sm',
  'company-footer': 'py-xl bg-gray-900 text-white',

  // 🎨 ブランディング
  'brand-primary': 'bg-blue-600 text-white',
  'brand-secondary': 'bg-gray-100 text-gray-900',
  'brand-accent': 'bg-yellow-400 text-black',

  // 📄 コンテンツ
  'content-wrapper': 'max-w-4xl mx-auto px-md py-xl',
  'article-content': 'prose prose-lg max-w-none',
  'cta-section': 'text-center py-2xl bg-blue-50',
}
```

### ダッシュボード・管理画面向け設定

```javascript
apply: {
  // 🏢 レイアウト
  'admin-layout': 'min-h-screen bg-gray-100',
  'sidebar-admin': 'w-64 bg-white shadow-lg',
  'main-content': 'flex-1 p-xl',
  'content-header': 'flex-between mb-xl',

  // 📊 データ表示
  'stat-card': 'card bg-gradient-to-r from-blue-500 to-blue-600 text-white',
  'data-table': 'w-full bg-white rounded-lg shadow overflow-hidden',
  'table-row': 'border-b border-gray-200 hover:bg-gray-50',
  'table-cell': 'px-md py-sm',

  // 🎛️ フォーム・コントロール
  'form-card': 'card max-w-2xl',
  'field-group': 'grid grid-cols-1 md:grid-cols-2 gap-md',
  'admin-btn': 'btn min-w-[120px]',
  'danger-btn': 'admin-btn bg-red-500 text-white hover:bg-red-600',
}
```

### Eコマース向け設定

```javascript
apply: {
  // 🛍️ 商品表示
  'product-grid': 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-lg',
  'product-card': 'card overflow-hidden group cursor-pointer',
  'product-image': 'w-full h-48 object-cover group-hover:scale-105 transition-transform',
  'product-info': 'p-md',
  'price-tag': 'text-xl font-bold text-green-600',

  // 🛒 ショッピング関連
  'cart-item': 'flex items-center gap-md p-md border-b',
  'quantity-control': 'flex items-center gap-sm',
  'checkout-btn': 'btn-primary w-full text-lg py-md',
  'add-to-cart': 'btn-primary w-full mt-md',

  // 📦 ステータス表示
  'status-badge': 'badge text-xs',
  'status-pending': 'status-badge bg-yellow-100 text-yellow-800',
  'status-shipped': 'status-badge bg-blue-100 text-blue-800',
  'status-delivered': 'status-badge bg-green-100 text-green-800',
}
```

### モバイルアプリ風設定

```javascript
apply: {
  // 📱 モバイルレイアウト
  'mobile-container': 'max-w-sm mx-auto bg-white min-h-screen',
  'mobile-header': 'sticky top-0 bg-white border-b px-md py-sm flex-between',
  'mobile-nav': 'fixed bottom-0 left-0 right-0 bg-white border-t px-md py-sm',
  'tab-bar': 'flex justify-around',

  // 👆 タッチインターフェース
  'touch-target': 'min-h-[44px] min-w-[44px] flex-center',
  'list-item': 'py-md px-md touch-target',
  'mobile-btn': 'w-full py-md rounded-lg text-center font-medium',

  // 💳 カード・リスト
  'mobile-card': 'mx-md my-sm rounded-xl shadow-sm bg-white p-md',
  'list-group': 'bg-white rounded-xl overflow-hidden mx-md',
  'list-separator': 'border-b border-gray-200 last:border-0',
}
```

## 🔧 ベストプラクティス

### 1. 一貫した命名規則

```javascript
// ✅ 推奨：BEM風の命名規則
apply: {
  'card': 'p-md rounded-lg border',
  'card__header': 'pb-sm mb-sm border-b',
  'card__body': 'py-sm',
  'card__footer': 'pt-sm mt-sm border-t',

  'btn': 'inline-block px-md py-sm rounded',
  'btn--primary': 'btn bg-blue-500 text-white',
  'btn--secondary': 'btn bg-gray-200 text-gray-800',
  'btn--large': 'btn px-lg py-md text-lg',
}

// ❌ 非推奨：命名がバラバラ
apply: {
  'Card': 'p-md',
  'cardHeader': 'pb-sm mb-sm',
  'card_body': 'py-sm',
  'CardFooter': 'pt-sm mt-sm',
}
```

### 2. 単一責任の原則

```javascript
// ✅ 推奨：各クラスが明確な責任を持つ
apply: {
  'flex-center': 'flex justify-center items-center',
  'text-center': 'text-center',
  'full-width': 'w-full',
  'shadow-soft': 'shadow-md',
}

// ❌ 非推奨：1つのクラスに多くの責任
apply: {
  'mega-component': 'flex justify-center items-center w-full h-full p-lg m-lg text-center shadow-lg bg-white border rounded',
}
```

### 3. 合成可能な設計

```javascript
// ✅ 推奨：小さな部品から組み立て可能
apply: {
  // 基本コンポーネント
  'surface': 'bg-white rounded-lg shadow-sm',
  'interactive': 'cursor-pointer transition-colors',
  'spacing-md': 'p-md',

  // 合成されたコンポーネント
  'card': 'surface spacing-md',
  'clickable-card': 'card interactive hover:shadow-md',
}

// ❌ 非推奨：全てを一から定義
apply: {
  'card': 'bg-white rounded-lg shadow-sm p-md',
  'clickable-card': 'bg-white rounded-lg shadow-md p-md cursor-pointer transition-colors',
}
```

### 4. プロジェクト固有の設定分離

```javascript
// ✅ 推奨：基本設定とプロジェクト固有設定を分離
// base.config.js (再利用可能な基本設定)
const baseApply = {
  'flex-center': 'flex justify-center items-center',
  card: 'p-md rounded-lg border',
  btn: 'inline-block px-md py-sm rounded',
};

// project.config.js (プロジェクト固有設定)
const projectApply = {
  'hero-banner': 'bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2xl',
  'brand-btn': 'btn bg-brand-500 text-white',
  'product-card': 'card hover:shadow-lg transition-shadow',
};

module.exports = {
  apply: {
    ...baseApply,
    ...projectApply,
  },
};
```

## 🎯 パフォーマンス考慮事項

### Apply設定の最適化

```javascript
// ✅ 推奨：よく使用される組み合わせのみをApply設定に
apply: {
  // 頻繁に使用される組み合わせ
  'flex-center': 'flex justify-center items-center',  // 使用頻度: 高
  'card': 'p-md rounded-lg border',                    // 使用頻度: 高

  // プロジェクト固有で再利用される組み合わせ
  'hero-section': 'py-2xl text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white',
}

// ❌ 非推奨：1回しか使わない組み合わせ
apply: {
  'very-specific-component': 'absolute top-[37px] left-[142px] w-[23px] h-[67px] bg-[#ff6b9d]',
}
```

### CSS生成効率の最適化

```javascript
// ✅ 推奨：パージ機能と組み合わせた最適化
module.exports = {
  content: ['src/**/*.{html,js,ts,jsx,tsx,vue,svelte}'],

  purge: {
    enabled: true,
    safelist: [
      // Apply設定で使用されるベースクラス
      /^btn/,
      /^card/,
      /^flex-/,
    ],
  },

  apply: {
    btn: 'inline-block px-md py-sm rounded cursor-pointer transition-colors',
    'btn-primary': 'btn bg-blue-500 text-white hover:bg-blue-600',
    card: 'p-md rounded-lg border border-gray-200 bg-white',
    'flex-center': 'flex justify-center items-center',
  },
};
```

## 🚀 まとめ

Apply設定は、SmsshCSSの最も強力な機能の一つです：

1. **🎨 再利用性**: よく使用される組み合わせを一度定義して何度でも使用
2. **🔧 保守性**: スタイルの変更が一箇所で済む
3. **⚡ 効率性**: 開発速度の向上とファイルサイズの最適化
4. **🎯 一貫性**: デザインシステムの統一とブランディングの強化

適切にApply設定を活用することで、効率的で保守性の高いCSSアーキテクチャを構築できます。
// ✅ 良い例：基本クラスを拡張
apply: {
'btn': 'inline-block px-md py-sm',
'btn-primary': 'btn',
'btn-secondary': 'btn',
'btn-large': 'btn px-lg py-md',
}

````

## 移行ガイド

### カスタム値の実現方法

カスタム値は任意値記法を使用して実現できます：`

#### CSS変数と任意値記法の組み合わせ

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
- 複雑な値はCSS変数と組み合わせて使用することでより柔軟に対応できます
````
