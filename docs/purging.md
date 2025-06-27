# SmsshCSS パージシステム - CSS最適化ガイド

SmsshCSSの高性能パージシステムは、使用されていないCSSクラスを自動的に検出・削除し、最適化されたCSSを生成します。本格的なプロダクション環境での使用を想定した包括的な最適化機能を提供します。

## 🎯 パージシステムの概要

### 主な機能

- **🔍 静的解析**: ソースファイルを解析して使用されているクラス名を自動検出
- **🛡️ セーフリスト**: 動的に生成されるクラス名を保護する柔軟な仕組み
- **🚫 ブロックリスト**: 不要なクラス名を明示的に除外
- **📊 詳細レポート**: パージ結果の包括的な分析とパフォーマンス統計
- **⚡ 高速処理**: 大量のファイルを効率的に処理する並列化システム
- **🎨 CSS機能対応**: keyframes、font-face、CSS変数の最適化

### パフォーマンス特性

```typescript
// パージ前: ~500KB の CSS
// パージ後: ~50KB の CSS (90%削減)
// 処理時間: ~100ms (10,000ファイル)
```

## ⚙️ 基本設定

### Viteプラグイン設定

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import smsshcss from '@smsshcss/vite';

export default defineConfig({
  plugins: [
    smsshcss({
      // 📂 コンテンツファイルの指定
      content: [
        'src/**/*.{html,js,ts,jsx,tsx,vue,svelte}',
        'components/**/*.{vue,jsx,tsx}',
        'pages/**/*.{js,ts,jsx,tsx}',
      ],

      // 🧹 パージ設定
      purge: {
        enabled: true,

        // 🔍 解析対象ファイル（contentと同じかより詳細に指定）
        content: ['src/**/*.{html,js,ts,jsx,tsx,vue,svelte}', 'public/**/*.html'],

        // 🛡️ セーフリスト（常に保持するクラス）
        safelist: [
          // 文字列で指定
          'always-keep-this-class',
          'dynamic-class-name',

          // 正規表現で指定
          /^hover:/, // hover:で始まる全てのクラス
          /^focus:/, // focus:で始まる全てのクラス
          /^btn-(primary|secondary|danger)$/, // 特定のボタンクラス
          /^text-(sm|md|lg|xl|2xl)$/, // テキストサイズクラス
          /^grid-cols-[1-9]$/, // グリッドカラムクラス
        ],

        // 🚫 ブロックリスト（明示的に除外するクラス）
        blocklist: [
          /^old-/, // old-で始まるクラスを除外
          /^deprecated-/, // deprecated-で始まるクラスを除外
          'unused-legacy-class',
        ],

        // 🎨 CSS機能の最適化
        keyframes: true, // 未使用のkeyframesを削除
        fontFace: true, // 未使用のfont-faceを削除
        variables: true, // 未使用のCSS変数を削除

        // 📊 レポート設定
        verbose: true, // 詳細ログを出力
      },

      // 📈 パージレポート表示
      showPurgeReport: true,
    }),
  ],
});
```

### 設定ファイル使用

```javascript
// smsshcss.config.js
module.exports = {
  content: ['src/**/*.{html,js,ts,jsx,tsx,vue,svelte}'],

  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: ['src/**/*.{html,js,ts,jsx,tsx,vue,svelte}'],

    safelist: [
      // 動的クラス名のパターン
      /^text-/,
      /^bg-/,
      /^border-/,

      // フレームワーク固有のクラス
      /^v-/, // Vue.js
      /^ng-/, // Angular
      /^react-/, // React
    ],

    blocklist: [/^test-/, /^debug-/, /^temp-/],

    keyframes: true,
    fontFace: true,
    variables: true,
    verbose: process.env.NODE_ENV === 'development',
  },
};
```

      /^bg-\w+-\d{3}$/,
    ],

},
};

````

### 3. ブロックリストの使用

特定のクラス名を強制的に除外します：

```typescript
const config = {
  purge: {
    enabled: true,
    content: ['src/**/*.{html,js,jsx,ts,tsx}'],
    blocklist: ['deprecated-class', /^old-/],
  },
};
````

## 高度な設定

### カスタムエクストラクター

特定のファイル形式に対してカスタムのクラス名抽出ロジックを定義できます：

```typescript
const config = {
  purge: {
    enabled: true,
    content: ['src/**/*.{html,js,jsx,ts,tsx}'],
    extractors: [
      {
        extensions: ['.vue'],
        extractor: (content) => {
          // Vue.js特有のクラス名抽出ロジック
          const classes = [];

          // :class="{ 'active': isActive }" パターン
          const dynamicClassPattern = /:class="[^"]*'([^']+)'[^"]*"/g;
          let match;
          while ((match = dynamicClassPattern.exec(content)) !== null) {
            classes.push(match[1]);
          }

          // 通常のclass属性
          const classPattern = /class="([^"]*)"/g;
          while ((match = classPattern.exec(content)) !== null) {
            classes.push(...match[1].split(/\s+/));
          }

          return [...new Set(classes)];
        },
      },
    ],
  },
};
```

### 詳細設定

```typescript
const config = {
  purge: {
    enabled: true,
    content: ['src/**/*.{html,js,jsx,ts,tsx}'],

    // @keyframes を保持するかどうか
    keyframes: true,

    // @font-face を保持するかどうか
    fontFace: true,

    // CSS変数を保持するかどうか
    variables: true,

    safelist: [
      // 動的クラス名のパターン
      /^(hover|focus|active):/,
      /^(sm|md|lg|xl):/,
    ],

    blocklist: [
      // 開発時のみのクラス
      'debug-border',
      /^test-/,
    ],
  },
};
```

## Viteプラグインでの使用

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import smsshcss from '@smsshcss/vite';

export default defineConfig({
  plugins: [
    smsshcss({
      content: ['index.html', 'src/**/*.{js,ts,jsx,tsx,vue}'],
      purge: {
        enabled: true,
        safelist: [/^btn-/, /^text-/, 'container', 'flex'],
      },
      showPurgeReport: true, // ビルド時にレポートを表示
    }),
  ],
});
```

## パージレポート

詳細なパージレポートを生成して、最適化の効果を確認できます：

```typescript
import { generatePurgeReport } from 'smsshcss';

const config = {
  content: ['src/**/*.{html,js,jsx,ts,tsx}'],
  purge: {
    enabled: true,
    content: ['src/**/*.{html,js,jsx,ts,tsx}'],
  },
};

const report = await generatePurgeReport(config);

if (report) {
  console.log(`Total classes: ${report.totalClasses}`);
  console.log(`Used classes: ${report.usedClasses}`);
  console.log(`Purged classes: ${report.purgedClasses}`);
  console.log(
    `Size reduction: ${((report.purgedClasses / report.totalClasses) * 100).toFixed(1)}%`
  );
  console.log(`Build time: ${report.buildTime}ms`);

  // ファイル別の解析結果
  report.fileAnalysis.forEach((file) => {
    console.log(`${file.file}: ${file.classesFound.length} classes found`);
  });
}
```

## 実際の使用例

### React プロジェクト

```typescript
// smsshcss.config.js
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    safelist: [
      // 動的に生成される可能性のあるクラス
      /^bg-(red|green|blue|yellow)-(100|200|300|400|500)$/,
      /^text-(xs|sm|base|lg|xl|2xl)$/,
      /^(p|m|px|py|mx|my)-\d+$/,

      // 条件付きクラス
      'active',
      'disabled',
      'loading',
    ],
    blocklist: [
      // 開発時のみのクラス
      'debug',
      'temp',
      /^dev-/,
    ],
  },
};
```

### Vue.js プロジェクト

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import smsshcss from '@smsshcss/vite';

export default defineConfig({
  plugins: [
    vue(),
    smsshcss({
      content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
      purge: {
        enabled: true,
        extractors: [
          {
            extensions: ['.vue'],
            extractor: (content) => {
              // Vue特有のクラス名抽出
              const classes = [];

              // :class 動的バインディング
              const dynamicPattern = /:class="[^"]*'([^']+)'[^"]*"/g;
              let match;
              while ((match = dynamicPattern.exec(content)) !== null) {
                classes.push(match[1]);
              }

              // 通常のclass属性
              const staticPattern = /class="([^"]*)"/g;
              while ((match = staticPattern.exec(content)) !== null) {
                classes.push(...match[1].split(/\s+/));
              }

              return [...new Set(classes.filter(Boolean))];
            },
          },
        ],
        safelist: [
          /^v-/, // Vue.jsディレクティブ
          /^router-/, // Vue Router
          'fade-enter-active',
          'fade-leave-active',
        ],
      },
      showPurgeReport: true,
    }),
  ],
});
```

## パフォーマンス最適化

### 大規模プロジェクトでの最適化

```typescript
const config = {
  content: ['src/**/*.{html,js,jsx,ts,tsx}'],
  purge: {
    enabled: true,
    content: ['src/**/*.{html,js,jsx,ts,tsx}'],

    // パフォーマンス最適化のための設定
    extractors: [
      {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        extractor: (content) => {
          // 高速化のため、シンプルな正規表現を使用
          const matches = content.match(/[A-Za-z0-9_-]+/g) || [];
          return matches.filter(
            (match) =>
              // クラス名らしいパターンのみを抽出
              /^[a-z]/.test(match) && match.length > 1
          );
        },
      },
    ],
  },
};
```

## トラブルシューティング

### よくある問題と解決方法

1. **動的クラス名が削除される**

   ```typescript
   // 問題: テンプレートリテラルで動的に生成されるクラス
   const className = `btn-${variant}`;

   // 解決: セーフリストに追加
   safelist: [/^btn-(primary|secondary|danger)$/];
   ```

2. **パフォーマンスが遅い**

   ```typescript
   // 解決: カスタムエクストラクターで最適化
   extractors: [
     {
       extensions: ['.tsx'],
       extractor: (content) => {
         // より効率的な抽出ロジック
         return (
           content
             .match(/className="([^"]*)"/g)
             ?.map((match) => match.slice(11, -1).split(/\s+/))
             .flat() || []
         );
       },
     },
   ];
   ```

3. **必要なクラスが削除される**
   ```typescript
   // 解決: より包括的なコンテンツパターン
   content: [
     'src/**/*.{html,js,jsx,ts,tsx,vue,svelte}',
     'components/**/*.{js,jsx,ts,tsx}',
     '!node_modules/**',
   ];
   ```

## ベストプラクティス

1. **開発時はパージを無効化**

   ```typescript
   purge: {
     enabled: process.env.NODE_ENV === 'production',
   }
   ```

2. **段階的な導入**

   ```typescript
   // 最初は safelist を多めに設定
   safelist: [
     /^btn-/,
     /^text-/,
     /^bg-/,
     // 徐々に絞り込む
   ];
   ```

3. **レポートの活用**

   ```typescript
   // 定期的にレポートを確認して最適化
   showPurgeReport: process.env.NODE_ENV === 'production';
   ```

4. **テストの実装**
   ```typescript
   // パージ後もアプリケーションが正常に動作することを確認
   // ビジュアルリグレッションテストの導入を推奨
   ```
