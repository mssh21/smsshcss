# ユーティリティクラステストの実例集

## 概要

このドキュメントでは、一般的なユーティリティクラスのテスト実装例を示します。新しいユーティリティクラスを追加する際の参考にしてください。

## 📐 レイアウト系ユーティリティ

### Flexbox系

```typescript
describe('Flexbox Utilities', () => {
  beforeEach(() => {
    setupDefaultMocks();
  });

  describe('flex display', () => {
    it('should generate flex class', () => {
      const generator = new CSSGenerator({
        content: ['<div class="flex">content</div>'],
      });
      const result = generator.generateFullCSSSync();

      expect(cssValidators.hasClass(result, 'flex')).toBe(true);
      expect(result).toMatch(/\.flex\s*\{\s*display:\s*flex/);
    });

    it('should generate inline-flex class', () => {
      const generator = new CSSGenerator({
        content: ['<div class="inline-flex">content</div>'],
      });
      const result = generator.generateFullCSSSync();

      expect(cssValidators.hasClass(result, 'inline-flex')).toBe(true);
      expect(result).toMatch(/\.inline-flex\s*\{\s*display:\s*inline-flex/);
    });
  });

  describe('flex direction', () => {
    const directions = [
      { class: 'flex-row', css: 'flex-direction: row' },
      { class: 'flex-col', css: 'flex-direction: column' },
      { class: 'flex-row-reverse', css: 'flex-direction: row-reverse' },
      { class: 'flex-col-reverse', css: 'flex-direction: column-reverse' },
    ];

    directions.forEach(({ class: className, css }) => {
      it(`should generate ${className} class`, () => {
        const generator = new CSSGenerator({
          content: [`<div class="${className}">content</div>`],
        });
        const result = generator.generateFullCSSSync();

        expect(cssValidators.hasClass(result, className)).toBe(true);
        expect(result).toContain(css.replace(/:/g, '\\s*:\\s*'));
      });
    });
  });
});
```

### Grid系

```typescript
describe('Grid Utilities', () => {
  beforeEach(() => {
    setupDefaultMocks();
  });

  it('should generate grid class', () => {
    const generator = new CSSGenerator({
      content: ['<div class="grid">content</div>'],
    });
    const result = generator.generateFullCSSSync();

    expect(cssValidators.hasClass(result, 'grid')).toBe(true);
    expect(result).toMatch(/\.grid\s*\{\s*display:\s*grid/);
  });

  describe('grid columns', () => {
    const columns = [1, 2, 3, 4, 6, 12];

    columns.forEach((col) => {
      it(`should generate grid-cols-${col} class`, () => {
        const className = `grid-cols-${col}`;
        const generator = new CSSGenerator({
          content: [`<div class="${className}">content</div>`],
        });
        const result = generator.generateFullCSSSync();

        expect(cssValidators.hasClass(result, className)).toBe(true);
        expect(result).toMatch(
          new RegExp(`\\.${className}\\s*\\{[^}]*grid-template-columns[^}]*\\}`)
        );
      });
    });
  });
});
```

## 🎨 スタイリング系ユーティリティ

### 色系

```typescript
describe('Color Utilities', () => {
  beforeEach(() => {
    setupDefaultMocks();
  });

  describe('text colors', () => {
    const colors = [
      { class: 'text-red-500', property: 'color' },
      { class: 'text-blue-600', property: 'color' },
      { class: 'text-gray-900', property: 'color' },
    ];

    colors.forEach(({ class: className, property }) => {
      it(`should generate ${className} class`, () => {
        const generator = new CSSGenerator({
          content: [`<div class="${className}">content</div>`],
        });
        const result = generator.generateFullCSSSync();

        expect(cssValidators.hasClass(result, className)).toBe(true);
        expect(result).toMatch(
          new RegExp(`\\.${className.replace(/-/g, '\\-')}\\s*\\{[^}]*${property}[^}]*\\}`)
        );
      });
    });
  });

  describe('background colors', () => {
    it('should generate background color classes', () => {
      const className = 'bg-red-500';
      const generator = new CSSGenerator({
        content: [`<div class="${className}">content</div>`],
      });
      const result = generator.generateFullCSSSync();

      expect(cssValidators.hasClass(result, className)).toBe(true);
      expect(result).toMatch(/\.bg-red-500\s*\{[^}]*background-color[^}]*\}/);
    });
  });
});
```

### タイポグラフィ系

```typescript
describe('Typography Utilities', () => {
  beforeEach(() => {
    setupDefaultMocks();
  });

  describe('font sizes', () => {
    const sizes = [
      { class: 'text-xs', expected: /font-size:\s*(0\.75rem|12px)/ },
      { class: 'text-sm', expected: /font-size:\s*(0\.875rem|14px)/ },
      { class: 'text-base', expected: /font-size:\s*(1rem|16px)/ },
      { class: 'text-lg', expected: /font-size:\s*(1\.125rem|18px)/ },
      { class: 'text-xl', expected: /font-size:\s*(1\.25rem|20px)/ },
    ];

    sizes.forEach(({ class: className, expected }) => {
      it(`should generate ${className} class`, () => {
        const generator = new CSSGenerator({
          content: [`<span class="${className}">text</span>`],
        });
        const result = generator.generateFullCSSSync();

        expect(cssValidators.hasClass(result, className)).toBe(true);
        expect(result).toMatch(expected);
      });
    });
  });

  describe('font weights', () => {
    const weights = [
      { class: 'font-normal', weight: '400' },
      { class: 'font-medium', weight: '500' },
      { class: 'font-semibold', weight: '600' },
      { class: 'font-bold', weight: '700' },
    ];

    weights.forEach(({ class: className, weight }) => {
      it(`should generate ${className} class`, () => {
        const generator = new CSSGenerator({
          content: [`<span class="${className}">text</span>`],
        });
        const result = generator.generateFullCSSSync();

        expect(cssValidators.hasClass(result, className)).toBe(true);
        expect(result).toMatch(new RegExp(`font-weight:\\s*${weight}`));
      });
    });
  });
});
```

## 📏 間隔系ユーティリティ

### Padding/Margin

```typescript
describe('Spacing Utilities', () => {
  beforeEach(() => {
    setupDefaultMocks();
  });

  describe('padding', () => {
    const spacings = [
      { class: 'p-0', css: 'padding: 0' },
      { class: 'p-1', css: 'padding: 0.25rem' },
      { class: 'p-2', css: 'padding: 0.5rem' },
      { class: 'p-4', css: 'padding: 1rem' },
      { class: 'px-4', css: 'padding-left: 1rem; padding-right: 1rem' },
      { class: 'py-2', css: 'padding-top: 0.5rem; padding-bottom: 0.5rem' },
      { class: 'pt-8', css: 'padding-top: 2rem' },
    ];

    spacings.forEach(({ class: className, css }) => {
      it(`should generate ${className} class`, () => {
        const generator = new CSSGenerator({
          content: [`<div class="${className}">content</div>`],
        });
        const result = generator.generateFullCSSSync();

        expect(cssValidators.hasClass(result, className)).toBe(true);

        // CSSの内容をチェック（柔軟なマッチング）
        const cssPattern = css
          .split(';')
          .map((prop) => prop.trim())
          .filter((prop) => prop.length > 0)
          .map((prop) => {
            const [property, value] = prop.split(':').map((p) => p.trim());
            return `${property}\\s*:\\s*${value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`;
          })
          .join('.*');

        expect(result).toMatch(new RegExp(cssPattern));
      });
    });
  });

  describe('margin', () => {
    it('should generate margin classes', () => {
      const className = 'm-4';
      const generator = new CSSGenerator({
        content: [`<div class="${className}">content</div>`],
      });
      const result = generator.generateFullCSSSync();

      expect(cssValidators.hasClass(result, className)).toBe(true);
      expect(result).toMatch(/margin:\s*1rem/);
    });

    it('should generate auto margin', () => {
      const className = 'm-auto';
      const generator = new CSSGenerator({
        content: [`<div class="${className}">content</div>`],
      });
      const result = generator.generateFullCSSSync();

      expect(cssValidators.hasClass(result, className)).toBe(true);
      expect(result).toMatch(/margin:\s*auto/);
    });
  });
});
```

## 🎯 カスタム値のテスト

```typescript
describe('Arbitrary Value Utilities', () => {
  beforeEach(() => {
    setupCustomMocks({
      'custom.html': `
        <div class="w-[100px] h-[50vh] p-[1.5rem] m-[calc(100%-20px)]">
          <span class="text-[#ff0000] bg-[rgb(255,255,255)] border-[2px]">
            Custom values
          </span>
        </div>
      `,
    });
  });

  it('should generate arbitrary width values', () => {
    const generator = new CSSGenerator({
      content: ['custom.html'],
    });
    const result = generator.generateFullCSSSync();

    expect(result).toMatch(/\.w-\[100px\]\s*\{\s*width:\s*100px/);
  });

  it('should generate arbitrary height values', () => {
    const generator = new CSSGenerator({
      content: ['custom.html'],
    });
    const result = generator.generateFullCSSSync();

    expect(result).toMatch(/\.h-\[50vh\]\s*\{\s*height:\s*50vh/);
  });

  it('should generate arbitrary padding values', () => {
    const generator = new CSSGenerator({
      content: ['custom.html'],
    });
    const result = generator.generateFullCSSSync();

    expect(result).toMatch(/\.p-\[1\.5rem\]\s*\{\s*padding:\s*1\.5rem/);
  });

  it('should handle calc() functions', () => {
    const generator = new CSSGenerator({
      content: ['custom.html'],
    });
    const result = generator.generateFullCSSSync();

    expect(result).toMatch(/\.m-\[calc\(100%-20px\)\]\s*\{\s*margin:\s*calc\(100%-20px\)/);
  });

  it('should handle color values', () => {
    const generator = new CSSGenerator({
      content: ['custom.html'],
    });
    const result = generator.generateFullCSSSync();

    expect(result).toMatch(/\.text-\[#ff0000\]\s*\{\s*color:\s*#ff0000/);
    expect(result).toMatch(
      /\.bg-\[rgb\(255,255,255\)\]\s*\{\s*background-color:\s*rgb\(255,255,255\)/
    );
  });
});
```

## 🔧 応答性のテスト

```typescript
describe('Responsive Utilities', () => {
  beforeEach(() => {
    setupCustomMocks({
      'responsive.html': `
        <div class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
          <p class="text-sm md:text-base lg:text-lg">Responsive text</p>
        </div>
      `,
    });
  });

  it('should generate responsive width classes', () => {
    const generator = new CSSGenerator({
      content: ['responsive.html'],
    });
    const result = generator.generateFullCSSSync();

    // ベースクラス
    expect(cssValidators.hasClass(result, 'w-full')).toBe(true);

    // レスポンシブクラス（メディアクエリ内）
    expect(result).toMatch(/@media[^{]*md[^{]*\{[^}]*\.md\\:w-1\/2/);
    expect(result).toMatch(/@media[^{]*lg[^{]*\{[^}]*\.lg\\:w-1\/3/);
    expect(result).toMatch(/@media[^{]*xl[^{]*\{[^}]*\.xl\\:w-1\/4/);
  });

  it('should generate responsive text classes', () => {
    const generator = new CSSGenerator({
      content: ['responsive.html'],
    });
    const result = generator.generateFullCSSSync();

    expect(cssValidators.hasClass(result, 'text-sm')).toBe(true);
    expect(result).toMatch(/@media[^{]*md[^{]*\{[^}]*\.md\\:text-base/);
    expect(result).toMatch(/@media[^{]*lg[^{]*\{[^}]*\.lg\\:text-lg/);
  });
});
```

## 🎨 疑似クラスのテスト

```typescript
describe('Pseudo-class Utilities', () => {
  beforeEach(() => {
    setupCustomMocks({
      'pseudo.html': `
        <button class="bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 active:bg-blue-800">
          Button
        </button>
        <input class="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
      `,
    });
  });

  it('should generate hover states', () => {
    const generator = new CSSGenerator({
      content: ['pseudo.html'],
    });
    const result = generator.generateFullCSSSync();

    expect(result).toMatch(/\.hover\\:bg-blue-600:hover\s*\{[^}]*background-color[^}]*\}/);
  });

  it('should generate focus states', () => {
    const generator = new CSSGenerator({
      content: ['pseudo.html'],
    });
    const result = generator.generateFullCSSSync();

    expect(result).toMatch(/\.focus\\:bg-blue-700:focus\s*\{[^}]*background-color[^}]*\}/);
    expect(result).toMatch(/\.focus\\:border-blue-500:focus\s*\{[^}]*border-color[^}]*\}/);
    expect(result).toMatch(/\.focus\\:ring-2:focus\s*\{[^}]*box-shadow[^}]*\}/);
  });

  it('should generate active states', () => {
    const generator = new CSSGenerator({
      content: ['pseudo.html'],
    });
    const result = generator.generateFullCSSSync();

    expect(result).toMatch(/\.active\\:bg-blue-800:active\s*\{[^}]*background-color[^}]*\}/);
  });
});
```

## 🧪 エラーケースのテスト

```typescript
describe('Edge Cases and Error Handling', () => {
  beforeEach(() => {
    setupDefaultMocks();
  });

  it('should handle malformed class names gracefully', () => {
    const generator = new CSSGenerator({
      content: ['<div class="invalid-class-name-!@#$%">content</div>'],
    });

    expect(() => generator.generateFullCSSSync()).not.toThrow();
    const result = generator.generateFullCSSSync();
    expect(cssValidators.isValidCSS(result)).toBe(true);
  });

  it('should handle extremely long class names', () => {
    const longClassName = 'very-long-class-name-' + 'x'.repeat(1000);
    const generator = new CSSGenerator({
      content: [`<div class="${longClassName}">content</div>`],
    });

    expect(() => generator.generateFullCSSSync()).not.toThrow();
  });

  it('should handle empty class attributes', () => {
    const generator = new CSSGenerator({
      content: ['<div class="">content</div>'],
    });

    const result = generator.generateFullCSSSync();
    expect(cssValidators.isValidCSS(result)).toBe(true);
  });

  it('should handle duplicate class names', () => {
    const generator = new CSSGenerator({
      content: ['<div class="p-4 p-4 p-4">content</div>'],
    });

    const result = generator.generateFullCSSSync();
    expect(cssValidators.isValidCSS(result)).toBe(true);

    // 重複したクラスが1回だけ生成されることを確認
    const matches = (result.match(/\.p-4\s*\{/g) || []).length;
    expect(matches).toBe(1);
  });
});
```

## 📝 テストの実行とデバッグ

```typescript
describe('Debug Utilities', () => {
  it('should provide debug information when test fails', () => {
    const generator = new CSSGenerator(testConfigs.minimal);
    const result = generator.generateFullCSSSync();

    // デバッグ情報の収集
    const debugInfo = {
      cssLength: result.length,
      classCount: cssValidators.countClasses(result),
      isValidCSS: cssValidators.isValidCSS(result),
      sample: result.substring(0, 500),
    };

    // テストが失敗した場合にデバッグ情報を表示
    if (!cssValidators.isValidCSS(result)) {
      console.log('Debug Info:', debugInfo);
    }

    expect(cssValidators.isValidCSS(result)).toBe(true);
  });
});
```
