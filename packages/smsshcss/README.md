# SmsshCSS コアパッケージ

> 🏗️ **Single Source of Truth** - 統合設定システムでCSS開発を効率化

SmsshCSSのコアパッケージは、すべての設定値を一元管理し、一貫性のあるデザインシステムを提供します。

## 🎯 特徴

- **統合設定システム**: すべての設定値を1箇所で管理
- **動的設定取得**: ユーティリティ関数による型安全な値取得
- **拡張可能**: プロジェクト固有の設定を簡単に追加
- **TypeScript完全対応**: 型安全性とIntelliSenseサポート
- **パフォーマンス最適化**: 遅延ロードとキャッシュ機能

## 📦 インストール

```bash
# npm
npm install smsshcss

# yarn
yarn add smsshcss

# pnpm
pnpm add smsshcss
```

## 🚀 クイックスタート

### 基本的な使用方法

```typescript
import { defaultConfig, getSpacingValue, getColorValue } from 'smsshcss';

// 統合設定からの値取得
console.log(defaultConfig.spacing.md); // "1.25rem"
console.log(defaultConfig.color['blue-500']); // "hsl(214 85% 55% / 1)"

// ユーティリティ関数による動的取得
const margin = getSpacingValue('lg'); // "2rem"
const primaryColor = getColorValue('blue-500'); // "hsl(214 85% 55% / 1)"
```

### Reactでの活用例

```jsx
import React from 'react';
import { defaultConfig, getSpacingValue, getColorValue } from 'smsshcss';

const Card = ({ children }) => {
  const styles = {
    padding: getSpacingValue('lg'),
    backgroundColor: getColorValue('white'),
    borderColor: getColorValue('gray-200'),
    borderRadius: defaultConfig.size.sm,
  };

  return <div style={styles}>{children}</div>;
};
```

### Vueでの活用例

```vue
<template>
  <div :style="cardStyles">
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { getSpacingValue, getColorValue, defaultConfig } from 'smsshcss';

const cardStyles = computed(() => ({
  padding: getSpacingValue('lg'),
  backgroundColor: getColorValue('white'),
  border: `1px solid ${getColorValue('gray-200')}`,
  borderRadius: defaultConfig.size.sm,
}));
</script>
```

## 📋 設定構造

### 統合設定オブジェクト

```typescript
import { defaultConfig } from 'smsshcss';

const config = defaultConfig;
// {
//   spacing: { '2xs': '0.25rem', xs: '0.5rem', ... },
//   color: { black: 'hsl(0 0% 0% / 1)', 'blue-500': 'hsl(214 85% 55% / 1)', ... },
//   fontSize: { xs: '0.75rem', sm: '0.875rem', ... },
//   size: { '2xs': '1rem', xs: '1.5rem', ... },
//   grid: { cols: 12, rows: 12, gap: '1rem' }
// }
```

### 個別設定の利用

```typescript
import {
  defaultColorConfig,
  defaultSpacingConfig,
  defaultFontSizeConfig,
  defaultSizeConfig,
  defaultGridConfig,
} from 'smsshcss';

// 特定の設定カテゴリのみ使用
const primaryColor = defaultColorConfig['blue-500'];
const mediumSpacing = defaultSpacingConfig.md;
```

## 🛠️ ユーティリティ関数

### 値取得関数

```typescript
import {
  getColorValue, // カラー値の取得
  getFontSizeValue, // フォントサイズ値の取得
  getSpacingValue, // スペーシング値の取得
  getSizeValue, // サイズ値の取得
  getGridValue, // グリッド値の取得
} from 'smsshcss';

// 使用例
const buttonStyles = {
  padding: `${getSpacingValue('sm')} ${getSpacingValue('md')}`,
  fontSize: getFontSizeValue('md'),
  backgroundColor: getColorValue('blue-500'),
  minWidth: getSizeValue('lg'),
  color: getColorValue('white'),
};
```

### 設定検証

```typescript
import { validateConfig, formatValidationResult } from 'smsshcss';

const customConfig = {
  spacing: { custom: '1.5rem' },
  color: { brand: 'invalid-color' }, // 無効な値
};

const validation = validateConfig(customConfig);
if (!validation.isValid) {
  console.log(formatValidationResult(validation));
  // エラー詳細が出力される
}
```

## 🎨 設定カテゴリ詳細

### スペーシング設定

```typescript
import { defaultSpacingConfig } from 'smsshcss';

// 利用可能な値
defaultSpacingConfig = {
  none: '0',
  '2xs': '0.25rem', // 4px
  xs: '0.5rem', // 8px
  sm: '0.75rem', // 12px
  md: '1.25rem', // 20px
  lg: '2rem', // 32px
  xl: '3.25rem', // 52px
  auto: 'auto',
};

// CSS生成例
// .m-md { margin: 1.25rem; }
// .p-lg { padding: 2rem; }
// .gap-sm { gap: 0.75rem; }
```

### カラー設定

```typescript
import { defaultColorConfig } from 'smsshcss';

// HSL形式での一貫したカラーパレット
defaultColorConfig = {
  black: 'hsl(0 0% 0% / 1)',
  white: 'hsl(0 0% 100% / 1)',
  'gray-100': 'hsl(210 6% 95% / 1)',
  'gray-500': 'hsl(210 2% 50% / 1)',
  'blue-500': 'hsl(214 85% 55% / 1)',
  'red-500': 'hsl(358 85% 55% / 1)',
  // ...
};

// CSS生成例
// .text-blue-500 { color: hsl(214 85% 55% / 1); }
// .bg-blue-500 { background-color: hsl(214 85% 55% / 1); }
```

### フォントサイズ設定

```typescript
import { defaultFontSizeConfig } from 'smsshcss';

defaultFontSizeConfig = {
  xs: '0.75rem', // 12px
  sm: '0.875rem', // 14px
  md: '1rem', // 16px
  lg: '1.25rem', // 20px
  xl: '1.5rem', // 24px
  '2xl': '2rem', // 32px
  // ...
};
```

## 🔧 カスタム設定

### 設定の拡張

```typescript
import { defaultSpacingConfig, defaultColorConfig } from 'smsshcss';

// ベース設定を拡張
export const projectConfig = {
  spacing: {
    ...defaultSpacingConfig,
    'brand-sm': '0.625rem',
    'brand-lg': '1.875rem',
  },
  color: {
    ...defaultColorConfig,
    'brand-primary': 'hsl(220 100% 50% / 1)',
    'brand-secondary': 'hsl(160 100% 45% / 1)',
  },
};
```

### 完全なカスタム設定

```typescript
import type { DefaultConfig } from 'smsshcss';

// 型安全なカスタム設定
const customConfig: Partial<DefaultConfig> = {
  spacing: {
    tight: '0.5rem',
    normal: '1rem',
    loose: '2rem',
  },
  color: {
    primary: 'hsl(210 100% 50% / 1)',
    secondary: 'hsl(150 100% 40% / 1)',
  },
};
```

### 動的設定取得

```typescript
// プロジェクト固有の設定管理システム
let configCache: any = null;

export const getProjectConfig = () => {
  if (!configCache) {
    const coreConfig = require('smsshcss');
    configCache = {
      ...coreConfig.defaultConfig,
      // プロジェクト固有の設定をオーバーライド
      spacing: {
        ...coreConfig.defaultConfig.spacing,
        custom: '1.5rem',
      },
    };
  }
  return configCache;
};

// 使用例
const styles = {
  margin: getProjectConfig().spacing.custom,
};
```

## 🧪 テスト統合

```typescript
import { defaultConfig, getSpacingValue } from 'smsshcss';

describe('Component Tests', () => {
  it('should use correct spacing values', () => {
    const component = renderComponent();

    // 実際の設定値でテスト
    expect(component).toHaveStyle({
      margin: getSpacingValue('md'), // "1.25rem"
    });
  });

  it('should use correct color values', () => {
    const actualColor = defaultConfig.color['blue-500'];
    expect(actualColor).toBe('hsl(214 85% 55% / 1)');
  });
});
```

## 📊 パフォーマンス

### 遅延ロード

```typescript
// 設定は必要な時にのみロードされます
const getConfig = () => {
  // 初回アクセス時のみロード処理が実行される
  return require('smsshcss').defaultConfig;
};
```

### キャッシュ機能

```typescript
// 一度取得した設定値はキャッシュされます
let cache = {};

const getCachedValue = (category: string, key: string) => {
  const cacheKey = `${category}.${key}`;
  if (!cache[cacheKey]) {
    cache[cacheKey] = getConfigValue(category, key);
  }
  return cache[cacheKey];
};
```

## 🔍 デバッグ

```typescript
import { defaultConfig } from 'smsshcss';

// 設定値の確認
console.table(defaultConfig.spacing);
console.table(defaultConfig.color);

// 特定の値の確認
console.log('Medium spacing:', defaultConfig.spacing.md);
console.log('Primary color:', defaultConfig.color['blue-500']);

// 設定の整合性チェック
import { validateConfig } from 'smsshcss';
const validation = validateConfig(defaultConfig);
console.log('Config is valid:', validation.isValid);
```

## 🤝 他のパッケージとの連携

### Viteプラグインとの統合

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import smsshcss from '@smsshcss/vite';
import { projectConfig } from './config/smsshcss.config';

export default defineConfig({
  plugins: [
    smsshcss({
      // コアパッケージの設定を自動的に使用
      // themeは廃止されました。任意値記法やapplyをご利用ください
    }),
  ],
});
```

### Webpackプラグインとの統合

```javascript
// webpack.config.js
const { defaultConfig } = require('smsshcss');

module.exports = {
  // WebpackプラグインがコアパッケージのdefaultConfigを自動的に参照
  plugins: [
    new SmsshCSSWebpackPlugin({
      config: defaultConfig,
    }),
  ],
};
```

## 📚 関連ドキュメント

- [アーキテクチャガイド](../../docs/architecture.md) - 設計思想と技術詳細
- [設定管理ガイド](../../docs/configuration.md) - 設定のカスタマイズ方法
- [ベストプラクティス](../../BEST_PRACTICES.md) - 推奨される使用方法
- [APIリファレンス](./API_REFERENCE.md) - 完全なAPI仕様

## 🐛 トラブルシューティング

### よくある問題

#### 設定値が取得できない

```typescript
// ❌ 問題: 設定値がundefined
const spacing = defaultConfig.spacing.invalid; // undefined

// ✅ 解決: 有効なキーを使用
const spacing = defaultConfig.spacing.md; // "1.25rem"

// ✅ 解決: 動的チェック
const spacing = defaultConfig.spacing.md || '1rem'; // フォールバック値
```

#### TypeScriptの型エラー

```typescript
// ❌ 問題: 型エラー
const customConfig = {
  spacing: { invalid: 'value' },
};

// ✅ 解決: 正しい型アサーション
import type { SpacingConfig } from 'smsshcss';

const customConfig: Partial<SpacingConfig> = {
  custom: '1.5rem',
} as const;
```

## 📄 ライセンス

MIT License - 詳細は [LICENSE](../../LICENSE) ファイルを参照してください。

## 🤝 コントリビューション

プルリクエストやイシューはいつでも歓迎です！

---

SmsshCSSコアパッケージで、一貫性のあるデザインシステムを構築しましょう 🎨
