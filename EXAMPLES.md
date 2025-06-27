# SmsshCSS 実用例集

このドキュメントでは、SmsshCSSを使用した実際のWebコンポーネントとレイアウトパターンの実用例を紹介します。

## 📚 目次

- [レイアウトパターン](#レイアウトパターン)
- [UIコンポーネント](#uiコンポーネント)
- [レスポンシブデザイン](#レスポンシブデザイン)
- [アニメーションとインタラクション](#アニメーションとインタラクション)
- [フォームとインプット](#フォームとインプット)
- [ナビゲーション](#ナビゲーション)
- [カードとメディア](#カードとメディア)

## 🏗️ レイアウトパターン

### 1. ヘッダー・メイン・フッターレイアウト

```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SmsshCSS レイアウト例</title>
  </head>
  <body class="min-h-screen flex flex-col">
    <!-- ヘッダー -->
    <header class="site-header">
      <div class="container">
        <nav class="flex-between">
          <div class="logo">
            <h1 class="text-xl font-bold">MyWebsite</h1>
          </div>
          <ul class="nav-menu">
            <li><a href="#" class="nav-link">ホーム</a></li>
            <li><a href="#" class="nav-link">サービス</a></li>
            <li><a href="#" class="nav-link">お問い合わせ</a></li>
          </ul>
        </nav>
      </div>
    </header>

    <!-- メインコンテンツ -->
    <main class="flex-1">
      <!-- ヒーローセクション -->
      <section class="hero-section">
        <div class="container">
          <div class="text-center">
            <h2 class="hero-title">美しいWebサイトを<br />素早く構築</h2>
            <p class="hero-subtitle">フィボナッチ数列ベースの調和の取れたデザイン</p>
            <div class="hero-actions">
              <button class="btn-primary">始める</button>
              <button class="btn-secondary">詳細を見る</button>
            </div>
          </div>
        </div>
      </section>

      <!-- コンテンツセクション -->
      <section class="content-section">
        <div class="container">
          <div class="grid grid-cols-3 gap-xl">
            <article class="feature-card">
              <h3 class="mb-md">高速</h3>
              <p>最小限のCSSで最大のパフォーマンス</p>
            </article>
            <article class="feature-card">
              <h3 class="mb-md">美しい</h3>
              <p>フィボナッチ数列による調和の取れたデザイン</p>
            </article>
            <article class="feature-card">
              <h3 class="mb-md">拡張可能</h3>
              <p>柔軟なカスタマイズとコンポーネント化</p>
            </article>
          </div>
        </div>
      </section>
    </main>

    <!-- フッター -->
    <footer class="site-footer">
      <div class="container">
        <div class="flex-between">
          <p>&copy; 2025 MyWebsite. All rights reserved.</p>
          <div class="social-links">
            <a href="#" class="social-link">Twitter</a>
            <a href="#" class="social-link">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  </body>
</html>
```

**Apply設定:**

```javascript
apply: {
  // レイアウト
  'container': 'w-full max-w-6xl mx-auto px-md',
  'site-header': 'bg-white border-b py-md sticky top-0 z-50',
  'site-footer': 'bg-gray-800 text-white py-xl mt-auto',

  // ナビゲーション
  'nav-menu': 'flex gap-lg list-none',
  'nav-link': 'text-gray-600 hover:text-blue-500 px-sm py-xs',

  // ヒーロー
  'hero-section': 'bg-gradient-to-br from-blue-50 to-indigo-100 py-2xl',
  'hero-title': 'text-4xl font-bold mb-md text-gray-900',
  'hero-subtitle': 'text-xl text-gray-600 mb-xl',
  'hero-actions': 'flex gap-md justify-center',

  // コンテンツ
  'content-section': 'py-2xl bg-white',
  'feature-card': 'p-xl bg-white rounded-lg border text-center',

  // ボタン
  'btn-primary': 'px-xl py-md bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors',
  'btn-secondary': 'px-xl py-md bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors',

  // ユーティリティ
  'flex-between': 'flex items-center justify-between',
  'flex-center': 'flex items-center justify-center',
}
```

### 2. サイドバー付きレイアウト

```html
<div class="app-layout">
  <!-- サイドバー -->
  <aside class="sidebar">
    <div class="sidebar-header">
      <h2 class="sidebar-title">メニュー</h2>
    </div>
    <nav class="sidebar-nav">
      <ul class="nav-list">
        <li><a href="#" class="nav-item active">ダッシュボード</a></li>
        <li><a href="#" class="nav-item">ユーザー</a></li>
        <li><a href="#" class="nav-item">設定</a></li>
        <li><a href="#" class="nav-item">ヘルプ</a></li>
      </ul>
    </nav>
  </aside>

  <!-- メインコンテンツ -->
  <main class="main-content">
    <header class="page-header">
      <h1 class="page-title">ダッシュボード</h1>
      <div class="page-actions">
        <button class="btn-primary">新規作成</button>
      </div>
    </header>

    <div class="content-grid">
      <section class="stats-grid">
        <div class="stat-card">
          <h3 class="stat-title">ユーザー数</h3>
          <p class="stat-value">1,234</p>
        </div>
        <div class="stat-card">
          <h3 class="stat-title">売上</h3>
          <p class="stat-value">¥567,890</p>
        </div>
        <div class="stat-card">
          <h3 class="stat-title">注文数</h3>
          <p class="stat-value">89</p>
        </div>
      </section>
    </div>
  </main>
</div>
```

**Apply設定:**

```javascript
apply: {
  // レイアウト
  'app-layout': 'min-h-screen flex bg-gray-50',
  'sidebar': 'w-64 bg-white border-r flex flex-col',
  'main-content': 'flex-1 flex flex-col',

  // サイドバー
  'sidebar-header': 'p-lg border-b',
  'sidebar-title': 'text-lg font-semibold text-gray-900',
  'sidebar-nav': 'flex-1 p-md',
  'nav-list': 'space-y-xs',
  'nav-item': 'block px-md py-sm rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900',
  'nav-item.active': 'bg-blue-100 text-blue-700',

  // ページヘッダー
  'page-header': 'bg-white border-b px-xl py-lg flex-between',
  'page-title': 'text-2xl font-bold text-gray-900',
  'page-actions': 'flex gap-md',

  // コンテンツ
  'content-grid': 'p-xl',
  'stats-grid': 'grid grid-cols-3 gap-lg mb-xl',
  'stat-card': 'bg-white p-lg rounded-lg border text-center',
  'stat-title': 'text-sm font-medium text-gray-600 mb-sm',
  'stat-value': 'text-3xl font-bold text-gray-900',
}
```

## 🧩 UIコンポーネント

### 1. カードコンポーネント

```html
<!-- 基本カード -->
<div class="card">
  <div class="card-header">
    <h3 class="card-title">カードタイトル</h3>
    <p class="card-subtitle">サブタイトル</p>
  </div>
  <div class="card-content">
    <p>
      カードの内容がここに入ります。フィボナッチ数列ベースのスペーシングで美しく配置されています。
    </p>
  </div>
  <div class="card-footer">
    <button class="btn-primary">アクション</button>
    <button class="btn-secondary">キャンセル</button>
  </div>
</div>

<!-- 画像付きカード -->
<div class="card">
  <div class="card-image">
    <img src="image.jpg" alt="カード画像" class="w-full h-48 object-cover" />
  </div>
  <div class="card-content">
    <h3 class="card-title">画像付きカード</h3>
    <p class="card-text">画像と組み合わせた美しいカードデザイン</p>
  </div>
</div>

<!-- ホバーエフェクト付きカード -->
<div class="card-hover">
  <div class="card-content">
    <h3 class="mb-sm">インタラクティブカード</h3>
    <p>ホバーで変化するカードデザイン</p>
  </div>
</div>
```

### 2. ボタンバリエーション

```html
<div class="button-showcase">
  <!-- プライマリボタン -->
  <button class="btn-primary">プライマリ</button>
  <button class="btn-primary-large">大きなプライマリ</button>
  <button class="btn-primary" disabled>無効状態</button>

  <!-- セカンダリボタン -->
  <button class="btn-secondary">セカンダリ</button>
  <button class="btn-outline">アウトライン</button>
  <button class="btn-ghost">ゴースト</button>

  <!-- 危険なアクション -->
  <button class="btn-danger">削除</button>
  <button class="btn-warning">警告</button>

  <!-- サイズバリエーション -->
  <button class="btn-small">小</button>
  <button class="btn-medium">中</button>
  <button class="btn-large">大</button>
</div>
```

### 3. モーダルダイアログ

```html
<!-- モーダルオーバーレイ -->
<div class="modal-overlay">
  <div class="modal-container">
    <div class="modal-header">
      <h2 class="modal-title">確認</h2>
      <button class="modal-close">&times;</button>
    </div>

    <div class="modal-content">
      <p>この操作を実行してもよろしいですか？</p>
    </div>

    <div class="modal-footer">
      <button class="btn-secondary">キャンセル</button>
      <button class="btn-danger">削除</button>
    </div>
  </div>
</div>
```

**Apply設定:**

```javascript
apply: {
  // カード
  'card': 'bg-white p-lg rounded-lg border shadow-sm',
  'card-header': 'mb-md pb-md border-b',
  'card-title': 'text-lg font-semibold text-gray-900 mb-xs',
  'card-subtitle': 'text-sm text-gray-600',
  'card-content': 'mb-md',
  'card-footer': 'flex gap-md justify-end pt-md border-t',
  'card-hover': 'card transition-transform hover:scale-105 cursor-pointer',

  // ボタン
  'btn-primary': 'px-lg py-md bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-200 transition-all',
  'btn-primary-large': 'px-xl py-lg bg-blue-500 text-white rounded-md hover:bg-blue-600 text-lg',
  'btn-secondary': 'px-lg py-md bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300',
  'btn-outline': 'px-lg py-md border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50',
  'btn-ghost': 'px-lg py-md text-blue-500 rounded-md hover:bg-blue-50',
  'btn-danger': 'px-lg py-md bg-red-500 text-white rounded-md hover:bg-red-600',
  'btn-warning': 'px-lg py-md bg-yellow-500 text-white rounded-md hover:bg-yellow-600',
  'btn-small': 'px-md py-sm text-sm bg-blue-500 text-white rounded',
  'btn-medium': 'px-lg py-md bg-blue-500 text-white rounded-md',
  'btn-large': 'px-xl py-lg text-lg bg-blue-500 text-white rounded-lg',

  // モーダル
  'modal-overlay': 'fixed inset-0 bg-black bg-opacity-50 flex-center z-50',
  'modal-container': 'bg-white rounded-lg shadow-xl max-w-md w-full mx-md',
  'modal-header': 'flex-between p-lg border-b',
  'modal-title': 'text-lg font-semibold',
  'modal-close': 'text-gray-400 hover:text-gray-600 text-2xl',
  'modal-content': 'p-lg',
  'modal-footer': 'flex gap-md justify-end p-lg border-t',
}
```

## 📱 レスポンシブデザイン

### 1. レスポンシブグリッド

```html
<div class="responsive-grid">
  <div class="grid-item">
    <div class="card">
      <h3>アイテム 1</h3>
      <p>レスポンシブに配置されるコンテンツ</p>
    </div>
  </div>
  <div class="grid-item">
    <div class="card">
      <h3>アイテム 2</h3>
      <p>画面サイズに応じて調整</p>
    </div>
  </div>
  <div class="grid-item">
    <div class="card">
      <h3>アイテム 3</h3>
      <p>美しいフィボナッチスペーシング</p>
    </div>
  </div>
</div>
```

**CSS変数でレスポンシブ対応:**

```html
<div
  class="responsive-container"
  style="
    --padding: clamp(1rem, 4vw, 3rem);
    --gap: clamp(0.75rem, 2vw, 1.25rem);
    --columns: clamp(1, 4vw, 4);
  "
>
  <div class="p-[var(--padding)] gap-[var(--gap)] grid grid-cols-[var(--columns)]">
    <!-- コンテンツ -->
  </div>
</div>
```

### 2. レスポンシブナビゲーション

```html
<nav class="responsive-nav">
  <div class="nav-container">
    <div class="nav-brand">
      <h1>Logo</h1>
    </div>

    <!-- デスクトップメニュー -->
    <ul class="nav-desktop">
      <li><a href="#" class="nav-link">ホーム</a></li>
      <li><a href="#" class="nav-link">サービス</a></li>
      <li><a href="#" class="nav-link">お問い合わせ</a></li>
    </ul>

    <!-- モバイルハンバーガーメニュー -->
    <button class="nav-toggle">
      <span></span>
      <span></span>
      <span></span>
    </button>
  </div>

  <!-- モバイルメニュー -->
  <ul class="nav-mobile hidden">
    <li><a href="#" class="nav-mobile-link">ホーム</a></li>
    <li><a href="#" class="nav-mobile-link">サービス</a></li>
    <li><a href="#" class="nav-mobile-link">お問い合わせ</a></li>
  </ul>
</nav>
```

## 🎨 アニメーションとインタラクション

### 1. ローディングアニメーション

```html
<div class="loading-container">
  <div class="loading-spinner"></div>
  <p class="loading-text">読み込み中...</p>
</div>

<!-- プログレスバー -->
<div class="progress-container">
  <div class="progress-bar" style="--progress: 60%"></div>
</div>

<!-- パルスエフェクト -->
<div class="pulse-container">
  <div class="pulse-item">
    <div class="pulse-circle"></div>
    <p>ライブ配信中</p>
  </div>
</div>
```

### 2. ホバーエフェクト

```html
<div class="hover-effects-demo">
  <!-- カードホバー -->
  <div class="hover-card">
    <h3>ホバーカード</h3>
    <p>マウスオーバーで変化</p>
  </div>

  <!-- ボタンホバー -->
  <button class="hover-button">
    <span>ホバーボタン</span>
  </button>

  <!-- 画像ホバー -->
  <div class="hover-image">
    <img src="image.jpg" alt="ホバー画像" />
    <div class="hover-overlay">
      <p>詳細を見る</p>
    </div>
  </div>
</div>
```

**Apply設定:**

```javascript
apply: {
  // レスポンシブ
  'responsive-grid': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg',
  'responsive-nav': 'bg-white border-b',
  'nav-container': 'container flex-between py-md',
  'nav-desktop': 'hidden md:flex gap-lg',
  'nav-mobile': 'md:hidden bg-white border-t p-md',
  'nav-toggle': 'md:hidden flex flex-col gap-xs p-sm',

  // アニメーション
  'loading-container': 'flex-center flex-col gap-md p-xl',
  'loading-spinner': 'w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin',
  'loading-text': 'text-gray-600',
  'progress-container': 'w-full bg-gray-200 rounded-full h-2',
  'progress-bar': 'bg-blue-500 h-2 rounded-full transition-all duration-300 w-[var(--progress)]',

  // ホバーエフェクト
  'hover-card': 'card transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
  'hover-button': 'btn-primary transition-all duration-200 hover:scale-105 active:scale-95',
  'hover-image': 'relative overflow-hidden rounded-lg group',
  'hover-overlay': 'absolute inset-0 bg-black bg-opacity-50 flex-center opacity-0 group-hover:opacity-100 transition-opacity',

  // ユーティリティ
  'pulse-circle': 'w-3 h-3 bg-red-500 rounded-full animate-pulse',
  'pulse-item': 'flex items-center gap-sm',
}
```

## 📝 フォームとインプット

### 1. 美しいフォームレイアウト

```html
<form class="form-container">
  <div class="form-header">
    <h2 class="form-title">お問い合わせ</h2>
    <p class="form-subtitle">お気軽にご連絡ください</p>
  </div>

  <div class="form-content">
    <!-- 名前フィールド -->
    <div class="form-group">
      <label class="form-label" for="name">お名前 *</label>
      <input type="text" id="name" class="form-input" placeholder="山田太郎" required />
    </div>

    <!-- メールフィールド -->
    <div class="form-group">
      <label class="form-label" for="email">メールアドレス *</label>
      <input type="email" id="email" class="form-input" placeholder="example@email.com" required />
    </div>

    <!-- セレクトボックス -->
    <div class="form-group">
      <label class="form-label" for="category">お問い合わせ種別</label>
      <select id="category" class="form-select">
        <option value="">選択してください</option>
        <option value="general">一般的なお問い合わせ</option>
        <option value="support">サポート</option>
        <option value="business">ビジネス</option>
      </select>
    </div>

    <!-- テキストエリア -->
    <div class="form-group">
      <label class="form-label" for="message">メッセージ *</label>
      <textarea
        id="message"
        class="form-textarea"
        rows="4"
        placeholder="お問い合わせ内容をご記入ください"
        required
      ></textarea>
    </div>

    <!-- チェックボックス -->
    <div class="form-group">
      <label class="form-checkbox">
        <input type="checkbox" required />
        <span class="checkmark"></span>
        <span class="checkbox-text">プライバシーポリシーに同意します</span>
      </label>
    </div>
  </div>

  <div class="form-footer">
    <button type="button" class="btn-secondary">リセット</button>
    <button type="submit" class="btn-primary">送信</button>
  </div>
</form>
```

### 2. インプットバリエーション

```html
<div class="input-showcase">
  <!-- 通常のインプット -->
  <div class="form-group">
    <label class="form-label">通常のインプット</label>
    <input type="text" class="form-input" placeholder="入力してください" />
  </div>

  <!-- エラー状態 -->
  <div class="form-group">
    <label class="form-label">エラー状態</label>
    <input type="text" class="form-input form-input-error" value="無効な値" />
    <p class="form-error">正しい形式で入力してください</p>
  </div>

  <!-- 成功状態 -->
  <div class="form-group">
    <label class="form-label">成功状態</label>
    <input type="text" class="form-input form-input-success" value="valid@email.com" />
    <p class="form-success">正しく入力されています</p>
  </div>

  <!-- アイコン付きインプット -->
  <div class="form-group">
    <label class="form-label">検索</label>
    <div class="input-with-icon">
      <input type="text" class="form-input" placeholder="検索..." />
      <div class="input-icon">🔍</div>
    </div>
  </div>
</div>
```

**Apply設定:**

```javascript
apply: {
  // フォーム
  'form-container': 'max-w-lg mx-auto bg-white p-xl rounded-lg border',
  'form-header': 'mb-xl text-center',
  'form-title': 'text-2xl font-bold text-gray-900 mb-sm',
  'form-subtitle': 'text-gray-600',
  'form-content': 'space-y-lg',
  'form-footer': 'flex gap-md justify-end pt-lg border-t mt-xl',

  // フォームグループ
  'form-group': 'space-y-sm',
  'form-label': 'block text-sm font-medium text-gray-700',

  // インプット
  'form-input': 'w-full px-md py-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-colors',
  'form-input-error': 'border-red-300 focus:ring-red-200 focus:border-red-500',
  'form-input-success': 'border-green-300 focus:ring-green-200 focus:border-green-500',
  'form-select': 'form-input',
  'form-textarea': 'form-input resize-vertical',

  // エラー・成功メッセージ
  'form-error': 'text-sm text-red-600 mt-xs',
  'form-success': 'text-sm text-green-600 mt-xs',

  // チェックボックス
  'form-checkbox': 'flex items-center gap-sm cursor-pointer',
  'checkbox-text': 'text-sm text-gray-700',

  // アイコン付きインプット
  'input-with-icon': 'relative',
  'input-icon': 'absolute right-md top-1/2 transform -translate-y-1/2 text-gray-400',
}
```

このような実用例を使用することで、開発者は具体的な実装パターンを理解し、SmsshCSSの力を最大限に活用できるようになります。各例はフィボナッチ数列ベースのスペーシングと、Apply設定による効率的なコンポーネント化を活用しています。
