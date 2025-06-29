# SmsshCSS 設定管理ガイド

## 概要

SmsshCSSは **Single Source of Truth (SSOT)** アーキテクチャを採用し、すべての設定をコアパッケージで一元管理しています。このガイドでは、設定の構造、カスタマイズ方法、ベストプラクティスについて説明します。

## 設定の構造

### 統合設定オブジェクト

```typescript
import { defaultConfig } from 'smsshcss';

// 統合設定にアクセス
const config = defaultConfig;
console.log(config.spacing.md); // "1.25rem"
console.log(config.color['blue-500']); // "hsl(214 85% 55% / 1)"
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

// 個別設定の利用
const primaryColor = defaultColorConfig['blue-500'];
const mediumSpacing = defaultSpacingConfig.md;
```

## 設定カテゴリ詳細

### 🎨 カラー設定 (colorConfig)

**ファイル**: `packages/smsshcss/src/config/colorConfig.ts`

```typescript
export const defaultColorConfig = {
  // 基本色
  black: 'hsl(0 0% 0% / 1)',
  white: 'hsl(0 0% 100% / 1)',

  // グレースケール
  'gray-100': 'hsl(210 6% 95% / 1)',
  'gray-500': 'hsl(210 2% 50% / 1)',
  'gray-900': 'hsl(210 6% 10% / 1)',

  // カラーパレット
  'blue-500': 'hsl(214 85% 55% / 1)',
  'red-500': 'hsl(358 85% 55% / 1)',
  'green-500': 'hsl(125 80% 50% / 1)',
  // ...
};
```

**生成されるCSSクラス**:

```css
.text-blue-500 {
  color: hsl(214 85% 55% / 1);
}
.bg-blue-500 {
  background-color: hsl(214 85% 55% / 1);
}
.border-blue-500 {
  border-color: hsl(214 85% 55% / 1);
}
```

### 📏 スペーシング設定 (spacingConfig)

**ファイル**: `packages/smsshcss/src/config/spacingConfig.ts`

```typescript
export const defaultSpacingConfig = {
  none: '0',
  '2xs': '0.25rem', // 4px
  xs: '0.5rem', // 8px
  sm: '0.75rem', // 12px
  md: '1.25rem', // 20px
  lg: '2rem', // 32px
  xl: '3.25rem', // 52px
  auto: 'auto',
};
```

**生成されるCSSクラス**:

```css
.m-md {
  margin: 1.25rem;
}
.p-md {
  padding: 1.25rem;
}
.gap-md {
  gap: 1.25rem;
}
.mx-md {
  margin-left: 1.25rem;
  margin-right: 1.25rem;
}
```

### 🔤 フォントサイズ設定 (fontSizeConfig)

**ファイル**: `packages/smsshcss/src/config/fontSizeConfig.ts`

```typescript
export const defaultFontSizeConfig = {
  xs: '0.75rem', // 12px
  sm: '0.875rem', // 14px
  md: '1rem', // 16px
  lg: '1.25rem', // 20px
  xl: '1.5rem', // 24px
  '2xl': '2rem', // 32px
  '3xl': '2.25rem', // 36px
  '4xl': '2.75rem', // 44px
};
```

### 📐 サイズ設定 (sizeConfig)

**ファイル**: `packages/smsshcss/src/config/sizeConfig.ts`

```typescript
export const defaultSizeConfig = {
  '2xs': '1rem', // 16px
  xs: '1.5rem', // 24px
  sm: '2rem', // 32px
  md: '2.5rem', // 40px
  lg: '3rem', // 48px
  xl: '4rem', // 64px
  full: '100%',
  screen: '100vw', // width用
  auto: 'auto',
};
```

### 🔲 グリッド設定 (gridConfig)

**ファイル**: `packages/smsshcss/src/config/gridConfig.ts`

```typescript
export const defaultGridConfig = {
  cols: 12,
  rows: 12,
  gap: '1rem',
};
```

## ユーティリティ関数

### 値の動的取得

```typescript
import { getColorValue, getFontSizeValue, getSpacingValue, getSizeValue } from 'smsshcss';

// 特定の値を取得
const primaryColor = getColorValue('blue-500');
const mediumSpacing = getSpacingValue('md');
const largeFont = getFontSizeValue('lg');
const fullWidth = getSizeValue('full');
```

### 設定の検証

```typescript
import { validateConfig } from 'smsshcss';

const customConfig = {
  spacing: { custom: '1.5rem' },
  color: { brand: 'hsl(200 50% 50% / 1)' },
};

const validation = validateConfig(customConfig);
if (validation.isValid) {
  console.log('設定は有効です');
} else {
  console.log('エラー:', validation.errors);
}
```

## カスタム設定の実装

### 1. 既存設定の拡張

```typescript
// カスタム設定ファイル
import { defaultSpacingConfig } from 'smsshcss';

export const customSpacingConfig = {
  ...defaultSpacingConfig,
  '3xs': '0.125rem', // 新しいサイズ追加
  '2xl': '5rem', // 新しいサイズ追加
  xxl: '8rem', // カスタムキー
};
```

### 2. 完全なカスタム設定

```typescript
// プロジェクト固有の設定
export const projectConfig = {
  spacing: {
    tight: '0.5rem',
    normal: '1rem',
    loose: '2rem',
    'extra-loose': '4rem',
  },
  color: {
    primary: 'hsl(210 100% 50% / 1)',
    secondary: 'hsl(150 100% 40% / 1)',
    accent: 'hsl(30 100% 60% / 1)',
  },
};
```

### 3. Viteプラグイン設定

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import smsshcss from '@smsshcss/vite';

export default defineConfig({
  plugins: [
    smsshcss({
      // カスタム値は任意値記法で指定
      // 例：m-[20px], bg-[hsl(220,100%,50%)]
      // Apply設定（カスタムクラス定義）
      apply: {
        'btn-primary': 'p-md bg-brand-primary text-white rounded',
        card: 'p-lg bg-white border border-gray-200 rounded-lg',
        container: 'max-w-lg mx-auto px-md',
      },
    }),
  ],
});
```

## ベストプラクティス

### ✅ 推奨パターン

#### 1. 設定の段階的拡張

```typescript
// Base設定
const baseSpacing = defaultSpacingConfig;

// プロジェクト固有の拡張
const projectSpacing = {
  ...baseSpacing,
  'project-sm': '0.625rem',
  'project-lg': '1.875rem',
};

// コンポーネント固有の拡張
const componentSpacing = {
  ...projectSpacing,
  'component-tight': '0.25rem',
};
```

#### 2. 命名規則の統一

```typescript
// ✅ 良い例：一貫した命名
const customConfig = {
  spacing: {
    micro: '0.125rem',
    macro: '4rem',
  },
  color: {
    'brand-primary': 'hsl(210 100% 50% / 1)',
    'brand-secondary': 'hsl(160 100% 45% / 1)',
  },
};

// ❌ 避けるべき：不統一な命名
const badConfig = {
  spacing: {
    very_small: '0.125rem', // アンダースコア
    LARGE: '4rem', // 大文字
  },
};
```

#### 3. 型安全性の確保

```typescript
import type { DefaultConfig } from 'smsshcss';

// 型安全なカスタム設定
const customConfig: Partial<DefaultConfig> = {
  spacing: {
    custom: '1.5rem',
  },
  color: {
    brand: 'hsl(200 50% 50% / 1)',
  },
};
```

### ❌ 避けるべきパターン

#### 1. ハードコードされた値

```typescript
// ❌ 避けるべき
const styles = {
  margin: '1.25rem', // ハードコード
  color: '#3b82f6', // ハードコード
};

// ✅ 推奨
import { getSpacingValue, getColorValue } from 'smsshcss';
const styles = {
  margin: getSpacingValue('md'),
  color: getColorValue('blue-500'),
};
```

#### 2. 設定の重複定義

```typescript
// ❌ 避けるべき：複数箇所での同じ設定
const componentA = {
  primaryColor: 'hsl(210 100% 50% / 1)',
};
const componentB = {
  primaryColor: 'hsl(210 100% 50% / 1)', // 重複
};

// ✅ 推奨：統一された設定の参照
import { getColorValue } from 'smsshcss';
const componentA = {
  primaryColor: getColorValue('blue-500'),
};
const componentB = {
  primaryColor: getColorValue('blue-500'),
};
```

## トラブルシューティング

### よくある問題と解決策

#### 1. 設定値が反映されない

**問題**: カスタム設定が適用されない

**解決策**:

```typescript
// 設定の優先順位を確認
import { defaultConfig } from 'smsshcss';

// 1. デフォルト設定の確認
console.log('Default:', defaultConfig.spacing.md);

// 2. カスタム設定の確認
console.log('Custom:', customConfig.spacing.md);

// 3. 最終的な設定の確認
const finalConfig = { ...defaultConfig, ...customConfig };
console.log('Final:', finalConfig.spacing.md);
```

#### 2. 型エラーが発生する

**問題**: TypeScriptで型エラーが発生

**解決策**:

```typescript
// 明示的な型アサーション
import type { SpacingConfig } from 'smsshcss';

const customSpacing: SpacingConfig = {
  custom: '1.5rem',
} as const;
```

#### 3. ビルド時エラー

**問題**: 設定インポート時のエラー

**解決策**:

```typescript
// 動的インポートの使用
const loadConfig = async () => {
  const { defaultConfig } = await import('smsshcss');
  return defaultConfig;
};
```

## パフォーマンス最適化

### 設定の遅延ロード

```typescript
// 必要な時にのみ設定をロード
let configCache: any = null;

const getConfig = () => {
  if (!configCache) {
    configCache = require('smsshcss').defaultConfig;
  }
  return configCache;
};
```

### 部分的な設定インポート

```typescript
// 必要な設定のみインポート
import { defaultSpacingConfig } from 'smsshcss';
// defaultConfig全体をインポートしない
```

---

この設定管理ガイドに従うことで、SmsshCSSの柔軟性を最大限に活用しながら、保守性の高いコードベースを維持できます。
