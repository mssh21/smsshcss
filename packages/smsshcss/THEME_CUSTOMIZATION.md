# SmsshCSS テーマカスタマイズガイド

SmsshCSSでは、ユーティリティクラスの値をカスタマイズしてプロジェクトに合わせたスタイルを作成できます。

## 基本的な考え方

Tailwind CSSと同様に、テーマ設定は**ユーティリティクラスの値を定義する**ためのものです。

```javascript
// ✅ ユーティリティファースト（SmsshCSSの正しいアプローチ）
theme: {
  spacing: {
    'button': '1rem'  // p-button クラスが生成される
  }
}
```

## スペーシングのカスタマイズ

### 基本的な数値の拡張

```javascript
theme: {
  spacing: {
    // 大きなサイズを追加
    '72': '18rem',    // m-72, p-72, gap-72
    '80': '20rem',    // m-80, p-80, gap-80
    '96': '24rem',    // m-96, p-96, gap-96
    '128': '32rem',   // m-128, p-128, gap-128
  }
}
```

生成されるクラス例：

```css
.m-72 {
  margin: 18rem;
}
.p-72 {
  padding: 18rem;
}
.gap-72 {
  gap: 18rem;
}
.mt-80 {
  margin-top: 20rem;
}
.px-96 {
  padding-left: 24rem;
  padding-right: 24rem;
}
```

### プロジェクト固有の名前付きサイズ

```javascript
theme: {
  spacing: {
    // レイアウト固有のサイズ
    'sidebar': '280px',   // m-sidebar, p-sidebar, gap-sidebar
    'header': '64px',     // m-header, p-header, gap-header
    'card': '1.5rem',     // m-card, p-card, gap-card
    'section': '3rem',    // m-section, p-section, gap-section
  }
}
```

使用例：

```html
<!-- サイドバーのレイアウト -->
<div class="w-sidebar p-card">
  <nav class="space-y-section">...</nav>
</div>

<!-- ヘッダーの高さとパディング -->
<header class="h-header px-section">...</header>
```

## 幅・高さのカスタマイズ

```javascript
theme: {
  width: {
    // 数値ベース
    '128': '32rem',      // w-128
    '144': '36rem',      // w-144

    // 名前ベース
    'sidebar': '280px',    // w-sidebar
    'content': '1024px',   // w-content
    'container': '1200px', // w-container
  },

  height: {
    'header': '64px',      // h-header
    'footer': '120px',     // h-footer
    'toolbar': '56px',     // h-toolbar
    'screen-header': 'calc(100vh - 64px)', // h-screen-header
  }
}
```

## グリッドのカスタマイズ

### グリッドカラム

```javascript
theme: {
  gridTemplateColumns: {
    // 数値ベース
    '16': 'repeat(16, minmax(0, 1fr))',  // grid-cols-16
    '20': 'repeat(20, minmax(0, 1fr))',  // grid-cols-20

    // レイアウトベース
    'sidebar-content': '280px 1fr',              // grid-cols-sidebar-content
    'nav-main-aside': '200px 1fr 300px',         // grid-cols-nav-main-aside
    'header-actions': '1fr auto',                // grid-cols-header-actions
  }
}
```

使用例：

```html
<!-- 3カラムレイアウト -->
<div class="grid grid-cols-nav-main-aside gap-4">
  <nav>...</nav>
  <main>...</main>
  <aside>...</aside>
</div>

<!-- ヘッダーとアクション -->
<header class="grid grid-cols-header-actions items-center p-4">
  <h1>タイトル</h1>
  <div>アクションボタン</div>
</header>
```

### グリッドロー

```javascript
theme: {
  gridTemplateRows: {
    'header-main-footer': '64px 1fr 120px',    // grid-rows-header-main-footer
    'toolbar-content': 'auto 1fr',             // grid-rows-toolbar-content
  }
}
```

## Z-indexのカスタマイズ

```javascript
theme: {
  zIndex: {
    // 数値ベース
    '60': '60',     // z-60
    '70': '70',     // z-70
    '100': '100',   // z-100

    // セマンティックベース
    'dropdown': '1000',      // z-dropdown
    'modal': '2000',         // z-modal
    'tooltip': '3000',       // z-tooltip
    'notification': '4000',  // z-notification
  }
}
```

## Order値のカスタマイズ

```javascript
theme: {
  order: {
    // レイアウト順序
    'header': '-10',   // order-header（最初）
    'nav': '-5',       // order-nav
    'main': '0',       // order-main（デフォルト）
    'aside': '5',      // order-aside
    'footer': '10',    // order-footer（最後）
  }
}
```

## 実践的な設定例

### 企業サイト向け

```javascript
theme: {
  spacing: {
    'hero': '8rem',        // ヒーローセクション用
    'section': '4rem',     // セクション間
    'content': '2rem',     // コンテンツ内余白
  },

  width: {
    'container': '1200px',  // メインコンテナ
    'content': '800px',     // 記事コンテンツ幅
  },

  height: {
    'hero': '60vh',         // ヒーローセクション高さ
    'navbar': '80px',       // ナビゲーションバー
  }
}
```

### ダッシュボード向け

```javascript
theme: {
  spacing: {
    'panel': '1.5rem',     // パネル内余白
    'widget': '1rem',      // ウィジェット間隔
  },

  width: {
    'sidebar': '280px',     // サイドバー幅
    'panel': '320px',       // パネル幅
  },

  gridTemplateColumns: {
    'dashboard': '280px 1fr',                    // サイドバー + メイン
    'metrics': 'repeat(auto-fit, minmax(250px, 1fr))', // メトリクスグリッド
  },

  zIndex: {
    'sidebar': '100',       // サイドバー
    'modal': '200',         // モーダル
    'tooltip': '300',       // ツールチップ
  }
}
```

### モバイルアプリ向け

```javascript
theme: {
  spacing: {
    'safe': '1rem',        // セーフエリア
    'touch': '44px',       // タッチ領域
    'list': '16px',        // リストアイテム間隔
  },

  height: {
    'header': '56px',       // モバイルヘッダー
    'tab': '48px',          // タブバー
    'touch': '44px',        // タッチ領域最小高さ
  },

  zIndex: {
    'bottomSheet': '100',   // ボトムシート
    'fab': '200',           // フローティングアクションボタン
    'snackbar': '300',      // スナックバー
  }
}
```

## カスタム値との併用

テーマ設定と`[arbitrary-value]`記法は併用できます：

```html
<!-- テーマ値 -->
<div class="w-sidebar h-header">
  <!-- カスタム値 -->
  <div class="w-[350px] h-[72px]">
    <!-- 組み合わせ -->
    <div class="w-sidebar h-[calc(100vh-64px)]"></div>
  </div>
</div>
```

## 設定のベストプラクティス

### 1. 一貫性のある命名

```javascript
// ✅ 良い例：一貫した命名
spacing: {
  'section': '3rem',
  'card': '1.5rem',
  'button': '1rem',
}

// ❌ 悪い例：命名がバラバラ
spacing: {
  'bigSpace': '3rem',
  'cardPadding': '1.5rem',
  'btn': '1rem',
}
```

### 2. 段階的なサイズ

```javascript
// ✅ 良い例：段階的なサイズ
spacing: {
  'xs': '0.5rem',
  'sm': '1rem',
  'md': '1.5rem',
  'lg': '2rem',
  'xl': '3rem',
}
```

### 3. プロジェクト固有の値

```javascript
// ✅ プロジェクトに特化した値
width: {
  'logo': '120px',        // ロゴ幅
  'avatar': '40px',       // アバター幅
  'thumbnail': '80px',    // サムネイル幅
}
```

## 利用可能なテーマ設定

### コンポーネントクラス 🆕

SmsshCSSの独自機能として、設定ファイルで直接コンポーネントクラスを定義できます。これにより、よく使うユーティリティクラスの組み合わせを1つのクラス名で適用できます。

```javascript
theme: {
  components: {
    'main-layout': 'w-lg mx-auto px-lg block',
    'card': 'p-md bg-white rounded-lg shadow-md',
    'btn-primary': 'inline-block px-md py-sm bg-blue-500 text-white rounded',
    'flex-center': 'flex justify-center items-center',
  }
}
```

使用例：

```html
<!-- この1つのクラスで複数のユーティリティが適用される -->
<div class="main-layout">
  <div class="card">
    <button class="btn-primary">クリック</button>
  </div>
</div>
```

生成されるCSS：

```css
.main-layout {
  width: 1.5rem;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  display: block;
}

.card {
  padding: 1rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

これはTailwindCSS の `@apply` ディレクティブに似た機能ですが、設定ファイルで直接定義できる点が異なります。

### スペーシング

// ... existing code ...

---

この設定により、プロジェクトに特化した使いやすいユーティリティクラスセットを作成できます。
