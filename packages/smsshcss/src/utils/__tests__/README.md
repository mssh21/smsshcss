# Utils ユニットテストガイド

## 概要

このディレクトリは各ユーティリティクラス生成関数の**ユニットテスト**を管理します。システム全体のテストは `src/__tests__/` を参照してください。

## 🧩 utils テストの特徴

### **純粋関数のテスト**

- ファイルシステムやモックは不要
- 設定オブジェクトを入力として関数を直接呼び出し
- 出力されるCSS文字列を検証

### **テスト構造の基本パターン**

```typescript
import { generateUtilityClasses } from '../utility-name';
import { defaultConfig } from '../../core/config';

describe('Utility Name', () => {
  describe('generateUtilityClasses', () => {
    it('should generate basic utility classes', () => {
      const result = generateUtilityClasses(defaultConfig);

      // 具体的なCSS文字列をチェック
      expect(result).toContain('.class-name { property: value; }');
    });
  });
});
```

## 📝 新しいユーティリティ関数のテスト追加手順

### **1. ファイル作成**

```bash
# 新しいユーティリティのテストファイルを作成
touch src/utils/__tests__/new-utility.test.ts
```

### **2. 基本テンプレート**

```typescript
import { describe, it, expect } from 'vitest';
import { generateNewUtilityClasses } from '../new-utility';
import { defaultNewUtilityConfig } from '../../core/config';

describe('New Utility Classes', () => {
  describe('generateNewUtilityClasses', () => {
    it('should generate basic utility classes', () => {
      const result = generateNewUtilityClasses(defaultNewUtilityConfig);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should generate specific utility classes', () => {
      const result = generateNewUtilityClasses(defaultNewUtilityConfig);

      // 期待される具体的なCSSクラスをチェック
      expect(result).toContain('.new-class { new-property: value; }');
    });
  });
});
```

### **3. 設定テストの追加**

```typescript
describe('Configuration Handling', () => {
  it('should handle custom configuration', () => {
    const customConfig = {
      'custom-value': 'custom-css-value',
    };

    const result = generateNewUtilityClasses(customConfig);
    expect(result).toContain('.custom-value { property: custom-css-value; }');
  });

  it('should handle empty configuration', () => {
    const result = generateNewUtilityClasses({});
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });
});
```

## 🎯 テストパターンの実例

### **1. 基本値のテスト**

```typescript
describe('Basic Values', () => {
  const basicValues = [
    { key: 'sm', value: '0.5rem' },
    { key: 'md', value: '1rem' },
    { key: 'lg', value: '1.5rem' },
  ];

  basicValues.forEach(({ key, value }) => {
    it(`should generate ${key} class`, () => {
      const config = { [key]: value };
      const result = generateUtilityClasses(config);

      expect(result).toContain(`.utility-${key} { property: ${value}; }`);
    });
  });
});
```

### **2. 方向性のあるクラス（spacing等）**

```typescript
describe('Directional Classes', () => {
  it('should generate all directional variants', () => {
    const config = { md: '1rem' };
    const result = generateSpacingClasses(config, 'margin');

    // 全方向のクラスをチェック
    expect(result).toContain('.m-md { margin: 1rem; }');
    expect(result).toContain('.mt-md { margin-top: 1rem; }');
    expect(result).toContain('.mr-md { margin-right: 1rem; }');
    expect(result).toContain('.mb-md { margin-bottom: 1rem; }');
    expect(result).toContain('.ml-md { margin-left: 1rem; }');
    expect(result).toContain('.mx-md { margin-left: 1rem; margin-right: 1rem; }');
    expect(result).toContain('.my-md { margin-top: 1rem; margin-bottom: 1rem; }');
  });
});
```

### **3. 任意値（カスタム値）のテスト**

```typescript
describe('Arbitrary Values', () => {
  it('should generate arbitrary value pattern', () => {
    const result = generateUtilityClasses({});

    // 任意値のテンプレートが含まれているかチェック
    expect(result).toContain('.utility-\\[\\$\\{value\\}\\] { property: var(--value); }');
  });
});
```

### **4. CSS関数のテスト**

```typescript
describe('CSS Functions', () => {
  it('should handle calc() values', () => {
    const config = { 'calc-sm': 'calc(100% - 1rem)' };
    const result = generateUtilityClasses(config);

    expect(result).toContain('.utility-calc-sm { property: calc(100% - 1rem); }');
  });

  it('should handle CSS variables', () => {
    const config = { 'var-custom': 'var(--custom-value)' };
    const result = generateUtilityClasses(config);

    expect(result).toContain('.utility-var-custom { property: var(--custom-value); }');
  });
});
```

## 🔧 テストユーティリティ

### **共通のテストヘルパー**

```typescript
// test-helpers.ts
export const testHelpers = {
  /**
   * 生成されたCSSが有効な構文かチェック
   */
  isValidCSS: (css: string): boolean => {
    const openBraces = (css.match(/{/g) || []).length;
    const closeBraces = (css.match(/}/g) || []).length;
    return openBraces === closeBraces && css.length > 0;
  },

  /**
   * 特定のクラスが含まれているかチェック
   */
  hasClass: (css: string, className: string): boolean => {
    const pattern = new RegExp(`\\.${className.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{`);
    return pattern.test(css);
  },

  /**
   * CSS内のクラス数をカウント
   */
  countClasses: (css: string): number => {
    const matches = css.match(/\.[a-zA-Z][\w-]*\s*\{/g);
    return matches ? matches.length : 0;
  },
};
```

### **使用例**

```typescript
import { testHelpers } from './test-helpers';

describe('Test with Helpers', () => {
  it('should generate valid CSS with correct class count', () => {
    const result = generateUtilityClasses(config);

    expect(testHelpers.isValidCSS(result)).toBe(true);
    expect(testHelpers.hasClass(result, 'utility-class')).toBe(true);
    expect(testHelpers.countClasses(result)).toBeGreaterThan(0);
  });
});
```

## 🧪 エラーケースとエッジケース

### **無効な設定の処理**

```typescript
describe('Error Handling', () => {
  it('should handle null configuration', () => {
    expect(() => generateUtilityClasses(null as any)).not.toThrow();
  });

  it('should handle undefined values in configuration', () => {
    const config = { 'valid-key': '1rem', 'invalid-key': undefined };
    expect(() => generateUtilityClasses(config)).not.toThrow();
  });

  it('should handle invalid CSS values', () => {
    const config = { invalid: 'not-a-valid-css-value' };
    const result = generateUtilityClasses(config);

    // 無効な値でも出力は生成される（CSSとしては無効でも）
    expect(result).toContain('not-a-valid-css-value');
  });
});
```

### **大量データの処理**

```typescript
describe('Performance', () => {
  it('should handle large configuration objects', () => {
    const largeConfig = {};
    for (let i = 0; i < 1000; i++) {
      largeConfig[`key-${i}`] = `${i}px`;
    }

    const startTime = performance.now();
    const result = generateUtilityClasses(largeConfig);
    const endTime = performance.now();

    expect(result).toBeTruthy();
    expect(endTime - startTime).toBeLessThan(100); // 100ms以内
  });
});
```

## 📊 実際のテストファイル例

### **spacing.test.ts のハイライト**

```typescript
// ✅ 良い例：具体的で明確なテスト
expect(result).toContain('.m-none { margin: 0; }');
expect(result).toContain('.m-auto { margin: auto; }');
expect(result).toContain(
  '.mx-md { margin-left: calc(var(--space-base) * 5); margin-right: calc(var(--space-base) * 5); }'
);

// ✅ 良い例：包括的なテスト
const spacingConfig = defaultSpacingValues;
const marginResult = generateSpacingClasses(spacingConfig, 'margin');
const paddingResult = generateSpacingClasses(spacingConfig, 'padding');
```

### **custom-values.test.ts のハイライト**

```typescript
// ✅ 良い例：エッジケースの包括的なテスト
it('should extract calc() values correctly', () => {
  const content = '<div class="m-[calc(100%-20px)] p-[calc(2rem+10px)]">Test</div>';
  const result = extractCustomSpacingClasses(content);

  expect(result).toContain('.m-\\[calc\\(100\\%\\-20px\\)\\] { margin: calc(100% - 20px); }');
});
```

## 🎯 チェックリスト

新しいユーティリティ関数をテストする際のチェックリスト：

- [ ] 基本的な設定でのクラス生成
- [ ] カスタム設定での動作確認
- [ ] 空の設定での動作確認
- [ ] 無効な設定でのエラーハンドリング
- [ ] 大量データでのパフォーマンス確認
- [ ] 生成されるCSS文字列の具体的な検証
- [ ] エッジケース（null、undefined等）の処理
- [ ] CSS関数（calc、var等）のサポート確認

## 📋 追加されたテストファイル

最近追加されたユーティリティクラスのテストファイル：

### **positioning.test.ts**

- Positioningユーティリティクラス（`position`）のテスト
- 各position値（static, relative, absolute, fixed, sticky）のテスト
- モーダル、ドロップダウン、スティッキーヘッダーのユースケーステスト

### **z-index.test.ts**

- Z-Indexユーティリティクラス（`z-index`）のテスト
- カスタムz-indexクラスの抽出と任意値のテスト
- CSS関数（`calc()`, `var()`）のサポート確認
- レイヤリング（モーダル、ドロップダウン、背景）のユースケーステスト

### **order.test.ts**

- Orderユーティリティクラス（`order-1` ～ `order-12`, `order-first`, `order-last`）のテスト
- FlexboxとGridコンテキストでの使用を想定したテスト
- カスタムorder値の抽出と任意値のテスト

### **overflow.test.ts**

- Overflowユーティリティクラス（`overflow`, `overflow-x`, `overflow-y`）のテスト
- 様々なoverflow値（`auto`, `hidden`, `scroll`, `clip`）のテスト
- テキスト省略やスクロール制御のユースケースに対応

### **各テストファイルの共通特徴**

- **基本クラス生成**: デフォルト設定でのクラス生成テスト
- **カスタム設定**: カスタム設定のマージと上書きテスト
- **エラーハンドリング**: null/undefined設定の適切な処理
- **エッジケース**: CSS関数やブラウザ固有値のサポート
- **実用的なユースケース**: 実際の使用場面を想定したテスト

## 🔗 関連ファイル

- `../../__tests__/TESTING_GUIDE.md` - 全体的なテストガイド
- `../../__tests__/UTILITY_CLASS_EXAMPLES.md` - 統合テストの例
- 各ユーティリティの実装ファイル (`../spacing.ts` 等)
- **新規追加テストファイル**: `positioning.test.ts`, `z-index.test.ts`, `order.test.ts`, `overflow.test.ts`
