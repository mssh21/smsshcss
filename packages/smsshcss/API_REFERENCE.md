# SmsshCSS API リファレンス

このドキュメントでは、SmsshCSSの全APIと設定オプションについて詳細に説明します。

## 📚 目次

- [メイン API](#メイン-api)
- [設定オプション](#設定オプション)
- [ユーティリティ関数](#ユーティリティ関数)
- [開発ツール](#開発ツール)
- [型定義](#型定義)

## 🚀 メイン API

### `generateCSS(config: SmsshCSSConfig): Promise<string>`

非同期でCSS を生成します。パージ機能が有効な場合は、使用されていないクラスを除去します。

```typescript
import { generateCSS } from 'smsshcss';

const css = await generateCSS({
  content: ['src/**/*.{html,js,ts,jsx,tsx}'],
  includeResetCSS: true,
  includeBaseCSS: true,
});

console.log(css); // 生成されたCSS文字列
```

### `generateCSSSync(config: SmsshCSSConfig): string`

同期的にCSS を生成します。後方互換性のために提供されています。

```typescript
import { generateCSSSync } from 'smsshcss';

const css = generateCSSSync({
  content: ['src/**/*.html'],
  includeResetCSS: false,
});
```

### `generatePurgeReport(config: SmsshCSSConfig): Promise<PurgeReport | null>`

パージ処理の詳細レポートを生成します。

```typescript
import { generatePurgeReport } from 'smsshcss';

const report = await generatePurgeReport({
  content: ['src/**/*.html'],
  purge: { enabled: true, content: ['src/**/*.html'] },
});

if (report) {
  console.log(`Total classes: ${report.totalClasses}`);
  console.log(`Used classes: ${report.usedClasses}`);
  console.log(`Purged classes: ${report.purgedClasses}`);
}
```

### `init(config?: SmsshCSSConfig): Promise<string>`

デフォルト設定でSmsshCSSを初期化します。

```typescript
import { init } from 'smsshcss';

// デフォルト設定で初期化
const css = await init();

// カスタム設定で初期化
const customCSS = await init({
  content: ['custom/**/*.vue'],
  theme: {
    spacing: { custom: '2.5rem' },
  },
});
```

## ⚙️ 設定オプション

### `SmsshCSSConfig`

メインの設定インターフェース：

```typescript
interface SmsshCSSConfig {
  content: string[]; // スキャン対象ファイルパターン
  safelist?: string[]; // 常に保持するクラス
  includeResetCSS?: boolean; // リセットCSSを含める
  includeBaseCSS?: boolean; // ベースCSSを含める
  purge?: PurgeConfig; // パージ設定
  apply?: ApplyConfig; // Apply設定
}
```

#### `content` (required)

スキャン対象のファイルパターンを配列で指定します。

```javascript
{
  content: [
    'index.html',
    'src/**/*.{html,js,ts,jsx,tsx,vue,svelte}',
    'components/**/*.vue',
    '!**/node_modules/**', // 除外パターン
  ];
}
```

#### `safelist` (optional)

パージ処理で削除されないクラスを指定します。

```javascript
{
  safelist: [
    'm-2xl', // 特定のクラス
    'p-2xl',
    /^hover:/, // 正規表現パターン
    /^focus:/,
  ];
}
```

### `PurgeConfig`

CSS パージの詳細設定：

```typescript
interface PurgeConfig {
  enabled?: boolean; // パージの有効/無効
  content: string[]; // パージ対象ファイル
  safelist?: (string | RegExp)[]; // 保護対象クラス
  blocklist?: (string | RegExp)[]; // 強制削除クラス
  keyframes?: boolean; // @keyframes を保持
  fontFace?: boolean; // @font-face を保持
  variables?: boolean; // CSS変数を保持
  extractors?: ExtractorConfig[]; // カスタム抽出器
}
```

#### 使用例

```javascript
{
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: ['src/**/*.{html,js,ts,jsx,tsx}'],

    safelist: [
      // 動的に生成されるクラス
      'm-2xl', 'p-2xl', 'gap-2xl',

      // 疑似クラス（正規表現）
      /^hover:p-/, /^focus:m-/, /^active:/,

      // レスポンシブクラス
      /^sm:/, /^md:/, /^lg:/,
    ],

    blocklist: [
      // 使用しないクラスを強制削除
      'm-2xs', 'p-2xs', 'gap-2xs',
      /^gap-x-2xs/, /^gap-y-2xs/,
    ],

    keyframes: true,   // アニメーションを保持
    fontFace: true,    // フォント定義を保持
    variables: true,   // CSS変数を保持

    extractors: [
      {
        extensions: ['vue'],
        extractor: (content) => {
          // Vue.js専用の抽出ロジック
          const matches = content.match(/class\s*=\s*["']([^"']*)["']/g) || [];
          return matches.flatMap(match =>
            match.replace(/class\s*=\s*["']/, '').replace(/["']$/, '').split(/\s+/)
          );
        }
      }
    ]
  }
}
```

### `ApplyConfig`

Apply設定の詳細：

```typescript
interface ApplyConfig {
  [className: string]: string; // クラス名: 適用するユーティリティクラス
}
```

#### 使用例

```javascript
{
  apply: {
    // レイアウト系コンポーネント
    'main-layout': 'w-lg mx-auto px-lg block',
    'container': 'max-w-[var(--container-width)] mx-auto px-sm md:px-md lg:px-lg',
    'flex-center': 'flex justify-center items-center',
    'flex-between': 'flex justify-between items-center',

    // カード系コンポーネント
    'card': 'p-md',
    'card-header': 'pb-sm mb-sm',
    'card-body': 'py-sm',
    'card-footer': 'pt-sm mt-sm',

    // ボタン系コンポーネント
    'btn': 'inline-block px-md py-sm',
    'btn-primary': 'btn',
    'btn-secondary': 'btn',

    // フォーム系コンポーネント
    'form-group': 'mb-md',
    'form-label': 'block mb-xs',
    'form-input': 'w-full px-sm py-xs',
  }
}
```

#### apply設定

よく使うユーティリティクラスの組み合わせを1つのクラス名として定義できます。

- **型**: `Record<string, string>`
- **デフォルト**: `undefined`

```javascript
apply: {
  'component-name': 'space-separated utility classes',
  // 実例:
  'btn': 'inline-block px-md py-sm',
  'btn-primary': 'btn',
  'container': 'max-w-[var(--container-width)] mx-auto px-sm md:px-md lg:px-lg',
}
```

生成されるCSS:

```css
.btn {
  display: inline-block;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
```

## 🔧 ユーティリティ関数

### スペーシング関連

```typescript
import { generateAllSpacingClasses, extractCustomSpacingClasses } from 'smsshcss/utils/spacing';

// デフォルトのスペーシングクラス生成
const spacingCSS = generateAllSpacingClasses();

// カスタムスペーシングクラス抽出
const customClasses = extractCustomSpacingClasses(`
  <div class="m-[20px] p-[1.5rem]">content</div>
`);
```

### ディスプレイ関連

```typescript
import { generateDisplayClasses } from 'smsshcss/utils/display';

// デフォルトのディスプレイクラス生成
const displayCSS = generateDisplayClasses();
```

### 幅・高さ関連

```typescript
import { generateAllWidthClasses, generateAllHeightClasses } from 'smsshcss/utils';

// デフォルトの幅クラス生成
const widthCSS = generateAllWidthClasses();

// デフォルトの高さクラス生成
const heightCSS = generateAllHeightClasses();
```

## 🛠️ 開発ツール

### `CSSGenerator` クラス

詳細な制御が必要な場合に使用：

```typescript
import { CSSGenerator } from 'smsshcss';

const generator = new CSSGenerator(config, {
  development: true, // 開発モード
  skipValidation: false, // バリデーション実行
  suppressWarnings: false, // 警告表示
});

// CSS生成
const css = await generator.generateFullCSS();

// パージレポート生成
const report = await generator.generatePurgeReport();
```

### 設定バリデーション

```typescript
import {
  validateConfig,
  formatValidationResult,
  validateConfigDetailed,
} from 'smsshcss/config-validator';

// 設定の妥当性チェック
const result = validateConfig(config);
console.log(result.isValid);
console.log(result.errors);
console.log(result.warnings);

// フォーマット済み結果
const formatted = formatValidationResult(result);
console.log(formatted);

// 詳細バリデーション（終了コード付き）
validateConfigDetailed(config);
```

### 開発ヘルパー

```typescript
import { devHelpers } from 'smsshcss/utils';

// 生成されるクラス数の計算
const count = devHelpers.calculateClassCount(
  { sm: '1rem', md: '2rem' },
  true // 方向指定あり
);

// 設定の妥当性チェック
const validation = devHelpers.validateConfig(config);

// CSS重複チェック
const duplicates = devHelpers.findDuplicateSelectors(css);
```

## 📝 型定義

### 主要な型

```typescript
// サイズ設定
interface SizeConfig {
  [key: string]: string | undefined;
  none: string;
  '2xs': string;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  // ... その他のサイズ
}

// パージレポート
interface PurgeReport {
  totalClasses: number;
  usedClasses: number;
  purgedClasses: number;
  purgedClassNames: string[];
  safelist: string[];
  buildTime: number;
  fileAnalysis: Array<{
    file: string;
    classesFound: string[];
    size: number;
  }>;
}

// 生成されたCSS
interface GeneratedCSS {
  utilities: string;
  components: string;
  base: string;
  reset: string;
}
```

### ユーティリティテンプレート

```typescript
interface UtilityTemplate {
  prefix: string; // クラス名プレフィックス
  property: string; // CSSプロパティ名
  hasDirections?: boolean; // 方向指定の有無
  supportsArbitraryValues?: boolean; // 任意値サポート
  valueTransform?: (value: string) => string; // 値変換関数
}
```

## 🎯 実践的な使用例

### 基本的な使用

```typescript
import { generateCSS } from 'smsshcss';

const css = await generateCSS({
  content: ['src/**/*.{html,js,ts,jsx,tsx}'],
  includeResetCSS: true,
  includeBaseCSS: true,
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: ['src/**/*.{html,js,ts,jsx,tsx}'],
  },
});
```

### Apply設定での使用

```typescript
const css = await generateCSS({
  content: ['src/**/*.vue'],
  apply: {
    'main-layout': 'w-lg mx-auto px-lg block',
    card: 'p-md',
    'card-header': 'pb-sm mb-sm',
    'card-body': 'py-sm',
    'card-footer': 'pt-sm mt-sm',
    btn: 'inline-block px-md py-sm',
    'btn-primary': 'btn',
    'flex-center': 'flex justify-center items-center',
  },
});
```

---

このAPIリファレンスがSmsshCSSの効果的な活用に役立つことを願っています。更なる詳細や例が必要な場合は、[開発者ガイド](./DEVELOPER_GUIDE.md)もご参照ください。
