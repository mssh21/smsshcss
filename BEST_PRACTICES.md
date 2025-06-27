# SmsshCSS ベストプラクティスガイド

このガイドでは、SmsshCSSを最も効果的に使用するためのベストプラクティス、パフォーマンス最適化、およびプロダクション環境での推奨事項について説明します。

## 📚 目次

- [基本的なベストプラクティス](#基本的なベストプラクティス)
- [パフォーマンス最適化](#パフォーマンス最適化)
- [プロダクション環境での推奨事項](#プロダクション環境での推奨事項)
- [チーム開発でのガイドライン](#チーム開発でのガイドライン)
- [トラブルシューティング](#トラブルシューティング)

## 🏆 基本的なベストプラクティス

### 1. フィボナッチ数列ベースのスペーシングを活用

**推奨：** デザインシステムの美しい比率を活用

```html
<!-- ✅ 推奨：フィボナッチ数列の使用 -->
<div class="p-md m-lg gap-sm">
  <h1 class="mb-md">タイトル</h1>
  <p class="px-lg py-sm">内容</p>
</div>

<!-- ❌ 非推奨：ランダムなカスタム値 -->
<div class="p-[17px] m-[23px] gap-[14px]"></div>
```

**理由：** フィボナッチ数列は自然界に現れる美しい比率で、視覚的調和を生み出します。

### 2. Apply設定を活用したコンポーネント化

**推奨：** よく使う組み合わせはApply設定で定義

```javascript
// vite.config.js
export default defineConfig({
  plugins: [
    smsshcss({
      apply: {
        card: 'p-lg bg-white border border-gray-200 rounded-md',
        'btn-primary': 'px-lg py-md bg-blue-500 text-white rounded-sm',
        container: 'w-full max-w-6xl mx-auto px-md',
        'section-spacing': 'py-xl px-md',
      },
    }),
  ],
});
```

```html
<!-- ✅ 推奨：Apply設定の使用 -->
<div class="card">
  <h2>カードタイトル</h2>
  <button class="btn-primary">アクション</button>
</div>

<!-- ❌ 非推奨：毎回同じクラスを書く -->
<div class="p-lg bg-white border border-gray-200 rounded-md"></div>
```

### 3. セマンティックなクラス名の使用

```javascript
apply: {
  // ✅ 推奨：用途を表すセマンティックな名前
  'hero-section': 'py-2xl px-lg text-center bg-gradient-to-r from-blue-500 to-purple-600',
  'article-content': 'max-w-4xl mx-auto px-md py-lg',
  'sidebar-nav': 'w-64 h-full bg-gray-50 p-md',

  // ❌ 非推奨：見た目だけを表す名前
  'blue-box': 'p-lg bg-blue-500',
  'big-text': 'text-2xl font-bold'
}
```

## ⚡ パフォーマンス最適化

### 1. パージ設定の最適化

**プロダクション環境での推奨設定：**

```javascript
// vite.config.js
export default defineConfig({
  plugins: [
    smsshcss({
      purge: {
        enabled: process.env.NODE_ENV === 'production',
        content: [
          './index.html',
          './src/**/*.{vue,js,ts,jsx,tsx}',
          './components/**/*.{vue,js,ts,jsx,tsx}',
        ],
        safelist: [
          // 動的に生成されるクラス
          /^hover:/,
          /^focus:/,
          /^active:/,
          // 状態管理で使用するクラス
          'loading',
          'error',
          'success',
        ],
        blocklist: [
          // 使用しないクラス
          /^debug-/,
          /^test-/,
        ],
      },
    }),
  ],
});
```

### 2. カスタム値の効率的な使用

**推奨：** CSS変数とカスタム値の組み合わせ

```html
<!-- ✅ 推奨：CSS変数でレスポンシブ対応 -->
<div class="p-[var(--responsive-padding)]" style="--responsive-padding: clamp(1rem, 4vw, 3rem);">
  レスポンシブパディング
</div>

<!-- ✅ 推奨：計算式の活用 -->
<div class="w-[calc(100%-var(--sidebar-width))]">サイドバーを除いた幅</div>
```

### 3. ビルド時間の最適化

```javascript
// 開発環境での高速化設定
export default defineConfig({
  plugins: [
    smsshcss({
      cache: true, // キャッシュを有効化
      debug: process.env.NODE_ENV === 'development',

      // 開発時はパージを無効化
      purge: {
        enabled: process.env.NODE_ENV === 'production',
      },
    }),
  ],
});
```

## 🚀 プロダクション環境での推奨事項

### 1. セキュリティ強化

```javascript
// セキュリティを重視した設定
export default defineConfig({
  plugins: [
    smsshcss({
      // カスタム値のセキュリティチェックを有効化
      security: {
        enableArbitraryValueValidation: true,
        maxArbitraryValueLength: 100,
        allowedFunctions: ['calc', 'min', 'max', 'clamp', 'var'],
        allowedUnits: ['px', 'rem', 'em', '%', 'vh', 'vw'],
      },
    }),
  ],
});
```

### 2. CSS最小化とgzip圧縮

```javascript
// ビルド最適化
export default defineConfig({
  plugins: [
    smsshcss({
      minify: true, // CSS最小化

      // 不要なCSSの除去
      purge: {
        enabled: true,
        keyframes: false, // 使用しないキーフレームを削除
        fontFace: false, // 使用しないフォントフェースを削除
      },
    }),
  ],

  build: {
    cssCodeSplit: true, // CSS分割
    rollupOptions: {
      output: {
        manualChunks: {
          smsshcss: ['smsshcss'],
        },
      },
    },
  },
});
```

### 3. パフォーマンス監視

```javascript
// パフォーマンス監視のための設定
export default defineConfig({
  plugins: [
    smsshcss({
      showPurgeReport: true, // パージレポートの表示

      // 詳細な統計情報
      stats: {
        showCacheStats: true,
        showGenerationTime: true,
        showClassCount: true,
      },
    }),
  ],
});
```

## 👥 チーム開発でのガイドライン

### 1. 設定ファイルの共有

**プロジェクトルートに `smsshcss.config.js` を配置：**

```javascript
// smsshcss.config.js - チーム共有の設定
module.exports = {
  content: ['./src/**/*.{html,vue,js,ts,jsx,tsx}', './components/**/*.{vue,js,ts,jsx,tsx}'],

  // チーム共通のApply設定
  apply: {
    // レイアウト系
    container: 'w-full max-w-6xl mx-auto px-md',
    section: 'py-xl px-md',

    // コンポーネント系
    card: 'bg-white p-lg rounded-md border border-gray-200',
    'btn-primary': 'px-lg py-md bg-blue-500 text-white rounded-sm hover:bg-blue-600',
    'btn-secondary': 'px-lg py-md bg-gray-200 text-gray-800 rounded-sm hover:bg-gray-300',

    // ユーティリティ組み合わせ
    'flex-center': 'flex items-center justify-center',
    'flex-between': 'flex items-center justify-between',
  },

  // セーフリスト（動的クラス対応）
  safelist: [/^hover:/, /^focus:/, /^active:/, 'loading', 'error', 'success'],
};
```

### 2. コードレビューのチェックポイント

**PRレビュー時の確認事項：**

- [ ] フィボナッチ数列のスペーシング値を使用している
- [ ] 共通パターンはApply設定として定義されている
- [ ] カスタム値は必要最小限に留まっている
- [ ] セマンティックなクラス名を使用している
- [ ] パフォーマンスに影響する大量のカスタム値がない

### 3. スタイルガイドラインの例

```html
<!-- ✅ 推奨パターン -->
<article class="article-content">
  <header class="section-header">
    <h1 class="mb-md">記事タイトル</h1>
    <p class="text-gray-600 mb-lg">2025年6月27日</p>
  </header>

  <main class="prose">
    <p class="mb-md">本文内容...</p>
  </main>

  <footer class="flex-between mt-xl pt-lg border-t">
    <div class="flex gap-sm">
      <button class="btn-secondary">戻る</button>
    </div>
    <button class="btn-primary">次へ</button>
  </footer>
</article>

<!-- ❌ 避けるべきパターン -->
<article class="max-w-4xl mx-auto px-md py-lg">
  <header class="pb-lg mb-lg border-b">
    <h1 class="mb-md text-3xl font-bold">記事タイトル</h1>
    <p class="text-gray-600 mb-lg text-sm">2025年6月27日</p>
  </header>
</article>
```

## 🔧 トラブルシューティング

### 1. よくある問題と解決策

**問題：** カスタム値が正しく生成されない

```html
<!-- 問題のあるケース -->
<div class="p-[invalid-value]">内容</div>
```

**解決策：**

```bash
# デバッグモードでの確認
yarn dev # または npm run dev

# バリデーションエラーの確認
yarn validate:config
```

**問題：** パフォーマンスが遅い

**解決策：**

```javascript
// vite.config.js - パフォーマンス改善
export default defineConfig({
  plugins: [
    smsshcss({
      cache: true, // キャッシュ有効化

      // content パターンを最適化
      content: [
        './src/**/*.{vue,js,ts,jsx,tsx}', // 具体的に指定
        '!./src/**/*.test.{js,ts}', // テストファイルを除外
      ],

      purge: {
        enabled: process.env.NODE_ENV === 'production', // 開発時は無効
      },
    }),
  ],
});
```

### 2. デバッグ手法

**統計情報の確認：**

```bash
# CSSサイズレポート
yarn size:report

# 重複クラスのチェック
yarn check:duplicates

# キャッシュ統計
yarn analyze:css
```

**開発時のデバッグ：**

```javascript
// デバッグ設定
export default defineConfig({
  plugins: [
    smsshcss({
      debug: true,
      showPurgeReport: true,

      // 詳細ログの有効化
      verbose: true,
    }),
  ],
});
```

### 3. パフォーマンス監視

**ビルド時間の測定：**

```bash
# ビルド時間の詳細確認
npm run build -- --verbose

# バンドルサイズの分析
npm install -g bundlephobia
bundlephobia smsshcss
```

## 📊 品質管理

### 1. 自動チェックの設定

**package.json にスクリプト追加：**

```json
{
  "scripts": {
    "css:validate": "yarn validate:config",
    "css:check": "yarn check:duplicates",
    "css:size": "yarn size:report",
    "css:all": "yarn css:validate && yarn css:check && yarn css:size"
  }
}
```

**CI/CDでの自動チェック：**

```yaml
# .github/workflows/css-quality.yml
name: CSS Quality Check

on: [push, pull_request]

jobs:
  css-quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - run: npm install
      - run: npm run css:all
```

### 2. 品質指標

**推奨される品質指標：**

- CSSファイルサイズ: < 50KB (gzip圧縮後)
- 使用率: > 80% (パージ後の実際の使用クラス比率)
- ビルド時間: < 5秒
- 重複クラス: 0個

## 🎯 まとめ

このベストプラクティスに従うことで：

1. **美しいデザイン**: フィボナッチ数列の調和の取れたスペーシング
2. **高速なパフォーマンス**: 効率的なパージとキャッシュ活用
3. **保守性の向上**: Apply設定とセマンティックなクラス名
4. **チーム開発の効率化**: 共通設定とコードレビューガイドライン

SmsshCSSの力を最大限に活用して、美しく、高速で、保守しやすいWebアプリケーションを構築しましょう。
