# @smsshcss/vite

SmsshCSSのViteプラグイン。CSSユーティリティクラスを自動生成し、プロジェクトに統合します。

## インストール

```bash
# npm
npm install @smsshcss/vite

# yarn
yarn add @smsshcss/vite

# pnpm
pnpm add @smsshcss/vite
```

## 使用方法

### 基本的な設定

`vite.config.ts`に以下のように設定を追加します：

```typescript
import { defineConfig } from 'vite';
import smsshcss from '@smsshcss/vite';

export default defineConfig({
  plugins: [smsshcss()],
});
```

### オプション

プラグインは以下のオプションをサポートしています：

```typescript
interface SmsshCSSViteOptions {
  /**
   * 生成するCSSの内容をカスタマイズ
   */
  content?: string[];

  /**
   * リセットCSSを含めるかどうか
   * @default true
   */
  includeResetCSS?: boolean;

  /**
   * ベースCSSを含めるかどうか
   * @default true
   */
  includeBaseCSS?: boolean;

  /**
   * テーマのカスタマイズ
   */
  theme?: {
    spacing?: Record<string, string>;
    display?: Record<string, string>;
  };
}
```

### カスタムテーマの設定例

```typescript
import { defineConfig } from 'vite';
import smsshcss from '@smsshcss/vite';

export default defineConfig({
  plugins: [
    smsshcss({
      includeResetCSS: true,
      includeBaseCSS: true,
      theme: {
        spacing: {
          custom: '2rem',
        },
        display: {
          custom: 'block',
        },
      },
    }),
  ],
});
```

## 生成されるユーティリティクラス

### Spacing

マージンとパディングのユーティリティクラスが生成されます：

```css
/* マージン */
.m-2xs {
  margin: 0.125rem;
} /* 2px */
.m-xs {
  margin: 0.25rem;
} /* 4px */
.m-sm {
  margin: 0.5rem;
} /* 8px */
.m-md {
  margin: 1rem;
} /* 16px */
.m-lg {
  margin: 1.5rem;
} /* 24px */
.m-xl {
  margin: 2rem;
} /* 32px */
.m-2xl {
  margin: 3rem;
} /* 48px */
.m-3xl {
  margin: 4rem;
} /* 64px */
.m-4xl {
  margin: 6rem;
} /* 96px */

/* パディング */
.p-2xs {
  padding: 0.125rem;
} /* 2px */
.p-xs {
  padding: 0.25rem;
} /* 4px */
.p-sm {
  padding: 0.5rem;
} /* 8px */
.p-md {
  padding: 1rem;
} /* 16px */
.p-lg {
  padding: 1.5rem;
} /* 24px */
.p-xl {
  padding: 2rem;
} /* 32px */
.p-2xl {
  padding: 3rem;
} /* 48px */
.p-3xl {
  padding: 4rem;
} /* 64px */
.p-4xl {
  padding: 6rem;
} /* 96px */

/* 方向指定 */
.mt-md {
  margin-top: 1rem;
}
.mr-md {
  margin-right: 1rem;
}
.mb-md {
  margin-bottom: 1rem;
}
.ml-md {
  margin-left: 1rem;
}

.pt-md {
  padding-top: 1rem;
}
.pr-md {
  padding-right: 1rem;
}
.pb-md {
  padding-bottom: 1rem;
}
.pl-md {
  padding-left: 1rem;
}

/* 任意の値 */
.m-[20px] {
  margin: 20px;
}
.p-[1.5rem] {
  padding: 1.5rem;
}
```

### Display

表示プロパティのユーティリティクラスが生成されます：

```css
.block {
  display: block;
}
.inline {
  display: inline;
}
.inline-block {
  display: inline-block;
}
.flex {
  display: block flex;
}
.inline-flex {
  display: inline flex;
}
.grid {
  display: block grid;
}
.inline-grid {
  display: inline grid;
}
.none {
  display: none;
}
```

## 使用例

### HTMLでの使用例

```html
<!-- マージンとパディング -->
<div class="m-md p-lg">
  <p class="mb-sm">マージンとパディングの例</p>
</div>

<!-- フレックスボックス -->
<div class="flex gap-md">
  <div class="p-sm">フレックスアイテム1</div>
  <div class="p-sm">フレックスアイテム2</div>
</div>

<!-- グリッド -->
<div class="grid gap-lg">
  <div class="p-md">グリッドアイテム1</div>
  <div class="p-md">グリッドアイテム2</div>
</div>
```

## 開発

### ビルド

```bash
yarn build
```

### テスト

```bash
yarn test
```

## ライセンス

MIT
