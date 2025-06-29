# SmsshCSS - 軽量ユーティリティファーストCSSフレームワーク

> 🏗️ **Single Source of Truth アーキテクチャ** - 設定の重複を排除し、一貫性のあるデザインシステムを実現

SmsshCSSは、高性能なユーティリティファーストCSSフレームワークです。型安全性とDeveloper Experienceを重視し、HTMLファイル内で使用されるクラスのみを生成する最適化されたCSSを提供します。

## ✨ 主な特徴

- **🏗️ 統合設定システム**: Single Source of Truthアーキテクチャで設定の重複を完全排除
- **🚀 高性能**: Just-In-Time生成と高速キャッシュシステムでミリ秒レベルの処理速度
- **🛡️ 型安全**: TypeScriptによる完全な型サポートと厳密なバリデーション
- **⚡ 直感的**: ユーティリティファーストの再利用可能なクラス設計
- **🎯 最適化**: 使用されたクラスのみを含む最小限のCSS生成
- **🔧 柔軟性**: 設定ファイルによる完全なカスタマイズ機能
- **📦 統合性**: Viteプラグインをサポート
- **🎨 独自機能**: Apply設定による再利用可能なコンポーネントクラス定義 🆕
- **🧪 開発体験**: 豊富なデバッグツールとパフォーマンス分析機能

## 🚀 クイックスタート

### インストール

```bash
# npm
npm install smsshcss @smsshcss/vite

# yarn
yarn add smsshcss @smsshcss/vite

# pnpm
pnpm add smsshcss @smsshcss/vite
```

### Vite設定（推奨）

`vite.config.js`にプラグインを追加：

```javascript
import { defineConfig } from 'vite';
import smsshcss from '@smsshcss/vite';

export default defineConfig({
  plugins: [
    smsshcss({
      includeResetCSS: true,
      includeBaseCSS: true,
      minify: false,
      debug: true,

      // コンテンツファイルの指定
      content: ['src/**/*.{html,js,ts,jsx,tsx,vue,svelte}'],

      // パージ設定（プロダクション最適化）
      purge: {
        enabled: true,
        safelist: [/^hover:/, /^focus:/],
        blocklist: [/^old-/],
        keyframes: true,
        fontFace: true,
        variables: true,
      },

      // Apply設定（コンポーネントクラス定義）
      apply: {
        // レイアウト
        'main-layout': 'w-full max-w-6xl mx-auto px-md',
        container: 'w-full max-w-4xl mx-auto px-md',

        // フレックスボックス
        'flex-center': 'flex justify-center items-center',
        'flex-between': 'flex justify-between items-center',

        // カード系コンポーネント
        card: 'p-md rounded-lg border border-gray-200',
        'card-header': 'pb-sm mb-sm border-b',
        'card-body': 'py-sm',

        // ボタン
        btn: 'inline-block px-md py-sm rounded cursor-pointer',
        'btn-primary': 'btn bg-blue-500 text-white hover:bg-blue-600',
        'btn-secondary': 'btn bg-gray-200 text-gray-800 hover:bg-gray-300',
      },

      showPurgeReport: true,
    }),
  ],
});
```

### HTMLでの使用

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>SmsshCSS Example</title>
  </head>
  <body>
    <!-- レイアウト -->
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
      <main class="py-xl">
        <!-- ヒーローセクション -->
        <section class="flex-center flex-col text-center py-2xl">
          <h2 class="text-4xl font-bold mb-lg">高性能なユーティリティファーストCSS</h2>
          <p class="text-lg text-gray-600 mb-xl">型安全で最適化されたCSSフレームワーク</p>
          <div class="flex gap-md">
            <button class="btn-primary">今すぐ始める</button>
            <button class="btn-secondary">例を見る</button>
          </div>
        </section>

        <!-- 特徴カード -->
        <section class="grid grid-cols-1 md:grid-cols-3 gap-lg py-xl">
          <div class="card">
            <div class="card-header">
              <h3 class="text-xl font-semibold">🚀 高性能</h3>
            </div>
            <div class="card-body">
              <p>JIT生成とキャッシュシステムでミリ秒レベルの処理速度</p>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h3 class="text-xl font-semibold">🛡️ 型安全</h3>
            </div>
            <div class="card-body">
              <p>TypeScriptによる完全な型サポートと厳密なバリデーション</p>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h3 class="text-xl font-semibold">⚡ 最適化</h3>
            </div>
            <div class="card-body">
              <p>使用されたクラスのみを含む最小限のCSS生成</p>
            </div>
          </div>
        </section>

        <!-- 任意値とCSS関数のサポート -->
        <section class="py-xl">
          <h3 class="text-2xl font-bold mb-lg">高度なCSS関数サポート</h3>

          <!-- レスポンシブスペーシング -->
          <div class="p-[clamp(1rem,4vw,3rem)] bg-gray-100 rounded-lg mb-md">
            <p>レスポンシブパディング: clamp(1rem, 4vw, 3rem)</p>
          </div>

          <!-- 計算値 -->
          <div class="h-[calc(100vh-200px)] bg-blue-50 rounded-lg p-md">
            <p>計算された高さ: calc(100vh - 200px)</p>
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

Viteプラグインが自動的に使用されたクラスを検出し、最適化されたCSSを生成します。

## 🛠️ 開発ツール

SmsshCSSには開発効率を向上させるための豊富なツールが付属しています：

### 設定ファイルの管理

```bash
# 設定ファイルの作成（サンプルをコピー）
cp node_modules/smsshcss/smsshcss.config.example.js smsshcss.config.js

# 設定の妥当性をチェック
npm run validate:config
# または
yarn validate:config
# または
pnpm validate:config
```

### 新しいユーティリティクラスの生成

```bash
# 基本的なユーティリティクラスを生成
npm run generate:utility color --css-property=color --prefix=text
yarn generate:utility color --css-property=color --prefix=text
pnpm generate:utility color --css-property=color --prefix=text

# 方向指定あり（margin, paddingのような）
npm run generate:utility border --directions --default-values='{"sm":"1px","md":"2px"}'
yarn generate:utility border --directions --default-values='{"sm":"1px","md":"2px"}'
pnpm generate:utility border --directions --default-values='{"sm":"1px","md":"2px"}'
```

### デバッグとパフォーマンス分析

```bash
# CSS生成の詳細情報を表示
npm run debug:classes
yarn debug:classes
pnpm debug:classes

# 重複するCSSセレクターをチェック
npm run check:duplicates
yarn check:duplicates
pnpm check:duplicates

# CSSサイズレポートを生成
npm run size:report
yarn size:report
pnpm size:report

# 利用可能な分析ツールを表示
npm run analyze:css
yarn analyze:css
pnpm analyze:css
```

## 📖 ドキュメント

### 📚 包括的なドキュメントガイド

- **[� ドキュメント目次](packages/smsshcss/DOCUMENTATION_INDEX.md)** - 全ドキュメントへのアクセスポイント
- **[� ベストプラクティスガイド](BEST_PRACTICES.md)** - 設計思想、最適化、品質管理の包括的なガイド 🆕
- **[💡 実用例集](EXAMPLES.md)** - レイアウト、UI、フォーム、レスポンシブの具体例 🆕

### 📖 コア仕様とAPI

- **[�🎨 ユーティリティクラス リファレンス](packages/smsshcss/UTILITY_CLASSES.md)** - 全ユーティリティクラスの詳細な一覧
- **[⚙️ Apply設定ガイド](packages/smsshcss/APPLY_CONFIGURATION.md)** - コンポーネントクラス定義のガイド
- **[🔧 API リファレンス](packages/smsshcss/API_REFERENCE.md)** - 全API関数の詳細説明

### 👨‍💻 開発者向け

- **[👨‍💻 開発者ガイド](packages/smsshcss/DEVELOPER_GUIDE.md)** - 開発環境のセットアップと新機能の追加方法
- **[🧹 パージ機能ガイド](docs/purging.md)** - CSS最適化とパージ設定
- **[� 設定ファイル例](packages/smsshcss/smsshcss.config.example.js)** - 完全な設定のサンプル

## 🎨 ユーティリティクラス

### フィボナッチスペーシングシステム

SmsshCSSは、フィボナッチ数列（1, 2, 3, 5, 8, 13, 21, 34, 55, 89...）を基準とした直感的なスペーシングシステムを採用。4pxを基本単位として計算：

| トークン | 値               | 計算     | フィボナッチ数 |
| -------- | ---------------- | -------- | -------------- |
| `2xs`    | 4px (0.25rem)    | 4px × 1  | 1              |
| `xs`     | 8px (0.5rem)     | 4px × 2  | 2              |
| `sm`     | 12px (0.75rem)   | 4px × 3  | 3              |
| `md`     | 20px (1.25rem)   | 4px × 5  | 5              |
| `lg`     | 32px (2rem)      | 4px × 8  | 8              |
| `xl`     | 52px (3.25rem)   | 4px × 13 | 13             |
| `2xl`    | 84px (5.25rem)   | 4px × 21 | 21             |
| `3xl`    | 136px (8.5rem)   | 4px × 34 | 34             |
| `4xl`    | 220px (13.75rem) | 4px × 55 | 55             |
| `5xl`    | 356px (22.25rem) | 4px × 89 | 89             |

### Margin & Padding

```html
<!-- 基本的なスペーシング -->
<div class="m-md p-lg">margin: 20px, padding: 32px</div>

<!-- 方向指定 -->
<div class="mt-lg mr-sm mb-xl ml-xs">個別方向指定</div>

<!-- 軸指定 -->
<div class="mx-md my-lg">水平・垂直軸指定</div>

<!-- 任意値（CSS関数サポート） -->
<div class="m-[20px] p-[1.5rem]">カスタム値</div>
<div class="mt-[calc(100vh/4)]">計算値</div>
<div class="p-[clamp(1rem,4vw,3rem)]">レスポンシブ値</div>
```

### Gap（Flexbox/Grid）

```html
<!-- Flexboxのgap -->
<div class="flex gap-md">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Gridのgap -->
<div class="grid grid-cols-3 gap-lg">
  <div>Grid Item 1</div>
  <div>Grid Item 2</div>
  <div>Grid Item 3</div>
</div>

<!-- レスポンシブgap -->
<div class="flex gap-[clamp(1rem,3vw,2rem)]">レスポンシブなアイテム間隔</div>
```

### Display

```html
<!-- 基本的なdisplay -->
<div class="block">display: block</div>
<div class="inline">display: inline</div>
<div class="inline-block">display: inline-block</div>
<div class="flex">display: flex</div>
<div class="inline-flex">display: inline-flex</div>
<div class="grid">display: grid</div>
<div class="inline-grid">display: inline-grid</div>
<div class="none">display: none</div>
<div class="hidden">display: none</div>

<!-- 特殊なdisplay -->
<div class="contents">display: contents</div>
<div class="flow-root">display: flow-root</div>
<div class="table">display: table</div>
<div class="table-cell">display: table-cell</div>
```

## 🚀 高度なCSS関数サポート

SmsshCSSは、レスポンシブデザインに最適化された豊富なCSS数学関数をサポートしています：

### 基本的なCSS関数

```html
<!-- calc() - 数学的計算 -->
<div class="m-[calc(1rem+10px)]">margin: calc(1rem + 10px)</div>
<div class="p-[calc(100%-20px)]">padding: calc(100% - 20px)</div>
<div class="h-[calc(100vh-64px)]">height: calc(100vh - 64px)</div>

<!-- min() - 最小値を選択 -->
<div class="m-[min(2rem,5vw)]">margin: min(2rem, 5vw)</div>
<div class="p-[min(1rem,3%)]">padding: min(1rem, 3%)</div>
<div class="gap-[min(1rem,3vw)]">gap: min(1rem, 3vw)</div>

<!-- max() - 最大値を選択 -->
<div class="m-[max(1rem,20px)]">margin: max(1rem, 20px)</div>
<div class="p-[max(0.5rem,1vw)]">padding: max(0.5rem, 1vw)</div>

<!-- clamp() - 値を範囲内に制限 -->
<div class="m-[clamp(1rem,4vw,3rem)]">margin: clamp(1rem, 4vw, 3rem)</div>
<div class="p-[clamp(0.5rem,2vw,2rem)]">padding: clamp(0.5rem, 2vw, 2rem)</div>
<div class="px-[clamp(1rem,5vw,4rem)]">レスポンシブな水平パディング</div>
```

### 高度な数学関数

```html
<!-- 数学演算関数 -->
<div class="m-[abs(-2rem)]">margin: abs(-2rem)</div>
<div class="p-[sign(1rem)]">padding: sign(1rem)</div>
<div class="mt-[mod(5rem,3rem)]">margin-top: mod(5rem, 3rem)</div>

<!-- 指数・対数関数 -->
<div class="px-[pow(2rem,2)]">padding-left/right: pow(2rem, 2)</div>
<div class="gap-[sqrt(4rem)]">gap: sqrt(4rem)</div>
<div class="m-[log(10rem)]">margin: log(10rem)</div>

<!-- 三角関数 -->
<div class="m-[sin(45deg)]">margin: sin(45deg)</div>
<div class="p-[cos(60deg)]">padding: cos(60deg)</div>
<div class="mt-[tan(30deg)]">margin-top: tan(30deg)</div>
```

### 複雑なネスト関数

```html
<!-- calc()内でのmin/max/clamp使用 -->
<div class="m-[calc(min(2rem,5vw)+10px)]">margin: calc(min(2rem, 5vw) + 10px)</div>

<!-- max()内でのcalc()とclamp()の組み合わせ -->
<div class="p-[max(calc(1rem*2),clamp(1rem,3vw,2rem))]">
  padding: max(calc(1rem * 2), clamp(1rem, 3vw, 2rem))
</div>

<!-- clamp()内でのcalc()使用 -->
<div class="mt-[clamp(calc(1rem+5px),4vw,calc(3rem-10px))]">
  margin-top: clamp(calc(1rem + 5px), 4vw, calc(3rem - 10px))
</div>
```

### CSS変数との組み合わせ

```html
<!-- CSS変数とCSS関数の組み合わせ -->
<div class="m-[var(--spacing-dynamic)]" style="--spacing-dynamic: clamp(1rem, 4vw, 3rem);">
  CSS変数とclamp関数の組み合わせ
</div>

<div class="p-[var(--responsive-padding)]" style="--responsive-padding: min(2rem, 5vw);">
  CSS変数とmin関数の組み合わせ
</div>
```

**サポートされているCSS関数一覧：**

- **calc()** - 数学的計算を実行
- **min()** - 複数の値から最小値を選択
- **max()** - 複数の値から最大値を選択
- **clamp()** - 最小値、推奨値、最大値の間で値を制限
- **abs()**, **sign()**, **mod()** - 基本的な数学演算
- **pow()**, **sqrt()**, **log()** - 指数・対数関数
- **sin()**, **cos()**, **tan()** - 三角関数

すべての関数は、margin (m-), padding (p-), gap の各ユーティリティで、全方向（t, r, b, l, x, y）に対応しています。

## 🚀 TypeScript統合と型安全性

SmsshCSSは任意値の型安全性を大幅に改善しました：

### 基本的な型安全性チェック

```typescript
import { validateArbitraryValue, isSafeArbitraryValue } from 'smsshcss';

// 任意値の検証
const result = validateArbitraryValue('calc(100% - 20px)', 'margin');
if (result.isValid) {
  console.log('✅ 有効な値:', result.sanitizedValue);
} else {
  console.error('❌ エラー:', result.errors);
}

// 安全性チェック
if (isSafeArbitraryValue('1rem')) {
  console.log('✅ 安全な値です');
}
```

### エラーハンドリングの強化

詳細なエラーメッセージとセキュリティチェック：

```typescript
import { ArbitraryValueValidator } from 'smsshcss';

const validator = new ArbitraryValueValidator({
  enableSecurityCheck: true,
  maxLength: 200,
  allowedFunctions: ['calc', 'min', 'max', 'clamp', 'var'],
  allowedUnits: ['px', 'rem', 'em', '%', 'vh', 'vw'],
});

const result = validator.validate('javascript:alert("xss")');
// { isValid: false, errors: ['JavaScript URLs are not allowed'] }
```

### パフォーマンス最適化

高速なキャッシュシステムとメモ化：

```typescript
import { memoize, PerformanceCache, logCacheStats } from 'smsshcss';

// 関数のメモ化
const memoizedValidator = memoize(validateArbitraryValue);

// キャッシュ統計の確認
logCacheStats();
// 📊 Performance Cache Statistics:
//   Cache Hits: 150
//   Cache Misses: 50
//   Hit Rate: 75%
```

### バッチ処理

大量の任意値を効率的に処理：

```typescript
import { BatchProcessor } from 'smsshcss';

const processor = new BatchProcessor(
  async (values) => values.map((v) => validateArbitraryValue(v)),
  50, // バッチサイズ
  10 // タイムアウト（ms）
);

// 大量の値を効率的に処理
const results = await Promise.all([
  processor.add('1rem'),
  processor.add('calc(100% - 20px)'),
  processor.add('clamp(1rem, 4vw, 3rem)'),
  // ... 数百の値
]);
```

### 設定バリデーション

設定エラーの詳細な診断：

```typescript
import { validateConfig, formatValidationResult } from 'smsshcss';

const config = {
  content: ['src/**/*.html'],
  // 設定オプション...
};

const validation = validateConfig(config);
if (!validation.isValid) {
  console.error(formatValidationResult(validation));
  // ❌ Configuration has errors:
  // 🚨 Errors:
  //   • content field is required and must be an array
  //   Path: content
  //   Fix: Add content: ["./src/**/*.{html,js,jsx,ts,tsx,vue,svelte}"]
}
```

## 🧪 デバッグとパフォーマンス分析

### キャッシュ統計の監視

```typescript
import { logValidatorStats, logCacheStats } from 'smsshcss';

// バリデーターの統計
logValidatorStats();

// 全体のキャッシュ統計
logCacheStats();
```

### カスタムバリデーション設定

```typescript
import { ArbitraryValueValidator } from 'smsshcss';

// プロダクション環境用（厳密）
const productionValidator = new ArbitraryValueValidator({
  enableSecurityCheck: true,
  maxLength: 100,
  allowedFunctions: ['calc', 'min', 'max', 'clamp'],
  allowedUnits: ['px', 'rem', '%', 'vh', 'vw'],
  debug: false,
});

// 開発環境用（緩やか）
const developmentValidator = new ArbitraryValueValidator({
  enableSecurityCheck: false,
  maxLength: 500,
  allowedFunctions: ['calc', 'min', 'max', 'clamp', 'var', 'env'],
  allowedUnits: ['px', 'rem', 'em', '%', 'vh', 'vw', 'ch', 'ex'],
  debug: true,
});
```

## 📄 ライセンス

MIT License

## 🤝 貢献

プルリクエストやイシューの報告を歓迎します。詳細は [CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。

## 🔗 関連リソース

- **[📚 ベストプラクティスガイド](BEST_PRACTICES.md)** - 設計思想、パフォーマンス最適化、品質管理の包括的なガイド
- **[💡 実用例集](EXAMPLES.md)** - レイアウト、UI、フォーム、レスポンシブの具体例
- **[🎮 プレイグラウンド](playground/vite-plugin/)** - インタラクティブなデモとサンプル

---

**SmsshCSS** - 高性能で型安全なユーティリティファーストCSSフレームワーク
