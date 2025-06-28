# SmsshCSS マイグレーションガイド

## 同期API から非同期API への移行

### 📢 なぜ移行が必要なのか？

同期版のAPI（`generateCSSSync`, `initSync`, `generateFullCSSSync`）は以下の問題があります：

1. **ファイルI/Oのブロッキング**: 大規模なプロジェクトでメインスレッドがブロックされる
2. **カスタムクラス抽出の欠如**: ファイルからの動的クラス抽出が実行されない
3. **モダンJavaScriptの標準**: 現代的なJavaScript開発では非同期I/Oが推奨される

### 🔄 移行方法

#### 1. `generateCSSSync` → `generateCSS`

**Before (同期版):**

```javascript
import { generateCSSSync } from 'smsshcss';

const css = generateCSSSync({
  content: ['src/**/*.{html,js,tsx}'],
  includeResetCSS: true,
});
console.log(css);
```

**After (非同期版):**

```javascript
import { generateCSS } from 'smsshcss';

async function buildCSS() {
  const css = await generateCSS({
    content: ['src/**/*.{html,js,tsx}'],
    includeResetCSS: true,
  });
  console.log(css);
}

buildCSS();
```

#### 2. `initSync` → `init`

**Before (同期版):**

```javascript
import { initSync } from 'smsshcss';

const css = initSync({
  content: ['src/**/*.html'],
});
```

**After (非同期版):**

```javascript
import { init } from 'smsshcss';

async function initializeCSS() {
  const css = await init({
    content: ['src/**/*.html'],
  });
  return css;
}
```

#### 3. `CSSGenerator.generateFullCSSSync` → `CSSGenerator.generateFullCSS`

**Before (同期版):**

```javascript
import { CSSGenerator } from 'smsshcss';

const generator = new CSSGenerator(config);
const css = generator.generateFullCSSSync();
```

**After (非同期版):**

```javascript
import { CSSGenerator } from 'smsshcss';

async function generateCSS() {
  const generator = new CSSGenerator(config);
  const css = await generator.generateFullCSS();
  return css;
}
```

### 🚀 Viteプラグインでの使用

Viteプラグイン内では既に非同期処理を使用しているため、特別な変更は不要です：

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import smsshcss from '@smsshcss/vite';

export default defineConfig({
  plugins: [
    smsshcss({
      content: ['src/**/*.{html,js,ts,jsx,tsx}'],
      includeReset: true,
    }),
  ],
});
```

### 🧪 テストでの移行

**Before (同期版):**

```javascript
import { generateCSSSync } from 'smsshcss';

test('CSS generation', () => {
  const css = generateCSSSync(config);
  expect(css).toContain('.p-md');
});
```

**After (非同期版):**

```javascript
import { generateCSS } from 'smsshcss';

test('CSS generation', async () => {
  const css = await generateCSS(config);
  expect(css).toContain('.p-md');
});
```

### ⚠️ 移行タイムライン

- **v2.3.0**: 同期APIに警告を追加（現在）
- **v2.4.0**: 警告の強化、TypeScript上でも非推奨マーク
- **v3.0.0**: 同期APIの完全削除（予定）

### 💡 移行のメリット

1. **パフォーマンス向上**: ノンブロッキングI/O
2. **機能の充実**: ファイルからのカスタムクラス抽出
3. **将来性**: モダンJavaScript標準への適合

### 🆘 困ったときは

移行で困った場合は以下をご利用ください：

- [GitHub Issues](https://github.com/mssh21/smsshcss/issues)
- [ドキュメント](./DOCUMENTATION_INDEX.md)
- [Examples](../../EXAMPLES.md)

### 📖 関連ドキュメント

- [API Reference](./API_REFERENCE.md)
- [Best Practices](../../BEST_PRACTICES.md)
- [Examples](../../EXAMPLES.md)
