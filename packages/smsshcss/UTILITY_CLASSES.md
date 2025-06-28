# SmsshCSS ユーティリティクラス リファレンス

このドキュメントでは、SmsshCSSで利用可能なすべてのユーティリティクラスを詳細に説明します。

## 📚 目次

- [Display](#display)
- [Spacing](#spacing)
- [Flexbox](#flexbox)
- [Grid](#grid)
- [Width & Height](#width--height)
- [Positioning](#positioning)
- [Overflow](#overflow)
- [Order](#order)
- [Z-Index](#z-index)

## Display

表示タイプを制御するユーティリティクラス。

### 基本的な表示タイプ

| クラス          | CSS                      |
| --------------- | ------------------------ |
| `.block`        | `display: block;`        |
| `.inline`       | `display: inline;`       |
| `.inline-block` | `display: inline-block;` |
| `.flex`         | `display: flex;`         |
| `.inline-flex`  | `display: inline-flex;`  |
| `.grid`         | `display: grid;`         |
| `.inline-grid`  | `display: inline-grid;`  |
| `.none`         | `display: none;`         |
| `.hidden`       | `display: none;`         |
| `.contents`     | `display: contents;`     |

### 追加の表示タイプ

| クラス           | CSS                       |
| ---------------- | ------------------------- |
| `.flow-root`     | `display: flow-root;`     |
| `.list-item`     | `display: list-item;`     |
| `.inline-table`  | `display: inline-table;`  |
| `.table`         | `display: table;`         |
| `.table-cell`    | `display: table-cell;`    |
| `.table-row`     | `display: table-row;`     |
| `.table-caption` | `display: table-caption;` |

## Spacing

要素のマージン、パディング、ギャップを制御するユーティリティクラス。

### サイズスケール

デフォルトのサイズスケール（フィボナッチ数列ベース）:

- `none`: `0`
- `auto`: `auto`
- `2xs`: `0.25rem` (4px) - `var(--space-base)`
- `xs`: `0.5rem` (8px) - `calc(var(--space-base) * 2)`
- `sm`: `0.75rem` (12px) - `calc(var(--space-base) * 3)`
- `md`: `1.25rem` (20px) - `calc(var(--space-base) * 5)`
- `lg`: `2rem` (32px) - `calc(var(--space-base) * 8)`
- `xl`: `3.25rem` (52px) - `calc(var(--space-base) * 13)`
- `2xl`: `5.25rem` (84px) - `calc(var(--space-base) * 21)`
- `3xl`: `8.5rem` (136px) - `calc(var(--space-base) * 34)`
- `4xl`: `13.75rem` (220px) - `calc(var(--space-base) * 55)`
- `5xl`: `22.25rem` (356px) - `calc(var(--space-base) * 89)`
- `6xl`: `36rem` (576px) - `calc(var(--space-base) * 144)`
- `7xl`: `48rem` (768px) - `calc(var(--space-base) * 192)`
- `8xl`: `64rem` (1024px) - `calc(var(--space-base) * 256)`
- `9xl`: `80rem` (1280px) - `calc(var(--space-base) * 320)`
- `10xl`: `96rem` (1536px) - `calc(var(--space-base) * 384)`
- `11xl`: `112rem` (1792px) - `calc(var(--space-base) * 448)`
- `12xl`: `128rem` (2048px) - `calc(var(--space-base) * 512)`

### レスポンシブ・動的な値

- `full`: `100%`
- `fit`: `fit-content`
- `min`: `min-content`
- `max`: `max-content`
- `screen`: `100vw`
- `dvh`: `100dvh`
- `dvw`: `100dvw`
- `cqw`: `100cqw`
- `cqi`: `100cqi`
- `cqmin`: `100cqmin`
- `cqmax`: `100cqmax`

### Margin

| クラス       | 説明             |
| ------------ | ---------------- |
| `.m-{size}`  | 全方向のマージン |
| `.mt-{size}` | 上マージン       |
| `.mr-{size}` | 右マージン       |
| `.mb-{size}` | 下マージン       |
| `.ml-{size}` | 左マージン       |
| `.mx-{size}` | 左右マージン     |
| `.my-{size}` | 上下マージン     |

### Padding

| クラス       | 説明               |
| ------------ | ------------------ |
| `.p-{size}`  | 全方向のパディング |
| `.pt-{size}` | 上パディング       |
| `.pr-{size}` | 右パディング       |
| `.pb-{size}` | 下パディング       |
| `.pl-{size}` | 左パディング       |
| `.px-{size}` | 左右パディング     |
| `.py-{size}` | 上下パディング     |

### Gap

| クラス          | 説明                          |
| --------------- | ----------------------------- |
| `.gap-{size}`   | グリッド/フレックスのギャップ |
| `.gap-x-{size}` | 水平方向のギャップ            |
| `.gap-y-{size}` | 垂直方向のギャップ            |

### カスタム値

任意の値を角括弧で指定できます：

- `.m-[20px]` → `margin: 20px;`
- `.p-[1.5rem]` → `padding: 1.5rem;`
- `.gap-[calc(1rem+10px)]` → `gap: calc(1rem + 10px);`

## Flexbox

フレックスボックスレイアウトを制御するユーティリティクラス。

### Flex Direction

| クラス              | CSS                               |
| ------------------- | --------------------------------- |
| `.flex-row`         | `flex-direction: row;`            |
| `.flex-row-reverse` | `flex-direction: row-reverse;`    |
| `.flex-col`         | `flex-direction: column;`         |
| `.flex-col-reverse` | `flex-direction: column-reverse;` |

### Flex Wrap

| クラス               | CSS                        |
| -------------------- | -------------------------- |
| `.flex-wrap`         | `flex-wrap: wrap;`         |
| `.flex-wrap-reverse` | `flex-wrap: wrap-reverse;` |
| `.flex-nowrap`       | `flex-wrap: nowrap;`       |

### Justify Content

| クラス             | CSS                               |
| ------------------ | --------------------------------- |
| `.justify-start`   | `justify-content: flex-start;`    |
| `.justify-end`     | `justify-content: flex-end;`      |
| `.justify-center`  | `justify-content: center;`        |
| `.justify-between` | `justify-content: space-between;` |
| `.justify-around`  | `justify-content: space-around;`  |
| `.justify-evenly`  | `justify-content: space-evenly;`  |

### Align Items

| クラス            | CSS                        |
| ----------------- | -------------------------- |
| `.items-start`    | `align-items: flex-start;` |
| `.items-end`      | `align-items: flex-end;`   |
| `.items-center`   | `align-items: center;`     |
| `.items-baseline` | `align-items: baseline;`   |
| `.items-stretch`  | `align-items: stretch;`    |

### Align Content

| クラス             | CSS                             |
| ------------------ | ------------------------------- |
| `.content-start`   | `align-content: flex-start;`    |
| `.content-end`     | `align-content: flex-end;`      |
| `.content-center`  | `align-content: center;`        |
| `.content-between` | `align-content: space-between;` |
| `.content-around`  | `align-content: space-around;`  |
| `.content-evenly`  | `align-content: space-evenly;`  |
| `.content-stretch` | `align-content: stretch;`       |

### Align Self

| クラス           | CSS                       |
| ---------------- | ------------------------- |
| `.self-auto`     | `align-self: auto;`       |
| `.self-start`    | `align-self: flex-start;` |
| `.self-end`      | `align-self: flex-end;`   |
| `.self-center`   | `align-self: center;`     |
| `.self-baseline` | `align-self: baseline;`   |
| `.self-stretch`  | `align-self: stretch;`    |

### Flex Properties

| クラス          | CSS               |
| --------------- | ----------------- |
| `.flex-initial` | `flex: 0 1 auto;` |
| `.flex-1`       | `flex: 1 1 0%;`   |
| `.flex-auto`    | `flex: 1 1 auto;` |
| `.flex-none`    | `flex: none;`     |
| `.grow-0`       | `flex-grow: 0;`   |
| `.grow-1`       | `flex-grow: 1;`   |
| `.shrink-0`     | `flex-shrink: 0;` |
| `.shrink-1`     | `flex-shrink: 1;` |

### カスタム値

- `.grow-[2]` → `flex-grow: 2;`
- `.shrink-[3]` → `flex-shrink: 3;`
- `.basis-[200px]` → `flex-basis: 200px;`

## Grid

グリッドレイアウトを制御するユーティリティクラス。

### Grid Template Columns

| クラス            | CSS                                                  |
| ----------------- | ---------------------------------------------------- |
| `.grid-cols-1`    | `grid-template-columns: repeat(1, minmax(0, 1fr));`  |
| `.grid-cols-2`    | `grid-template-columns: repeat(2, minmax(0, 1fr));`  |
| `.grid-cols-3`    | `grid-template-columns: repeat(3, minmax(0, 1fr));`  |
| `.grid-cols-4`    | `grid-template-columns: repeat(4, minmax(0, 1fr));`  |
| `.grid-cols-5`    | `grid-template-columns: repeat(5, minmax(0, 1fr));`  |
| `.grid-cols-6`    | `grid-template-columns: repeat(6, minmax(0, 1fr));`  |
| `.grid-cols-7`    | `grid-template-columns: repeat(7, minmax(0, 1fr));`  |
| `.grid-cols-8`    | `grid-template-columns: repeat(8, minmax(0, 1fr));`  |
| `.grid-cols-9`    | `grid-template-columns: repeat(9, minmax(0, 1fr));`  |
| `.grid-cols-10`   | `grid-template-columns: repeat(10, minmax(0, 1fr));` |
| `.grid-cols-11`   | `grid-template-columns: repeat(11, minmax(0, 1fr));` |
| `.grid-cols-12`   | `grid-template-columns: repeat(12, minmax(0, 1fr));` |
| `.grid-cols-none` | `grid-template-columns: none;`                       |

### Grid Template Rows

| クラス            | CSS                                              |
| ----------------- | ------------------------------------------------ |
| `.grid-rows-1`    | `grid-template-rows: repeat(1, minmax(0, 1fr));` |
| `.grid-rows-2`    | `grid-template-rows: repeat(2, minmax(0, 1fr));` |
| `.grid-rows-3`    | `grid-template-rows: repeat(3, minmax(0, 1fr));` |
| `.grid-rows-4`    | `grid-template-rows: repeat(4, minmax(0, 1fr));` |
| `.grid-rows-5`    | `grid-template-rows: repeat(5, minmax(0, 1fr));` |
| `.grid-rows-6`    | `grid-template-rows: repeat(6, minmax(0, 1fr));` |
| `.grid-rows-none` | `grid-template-rows: none;`                      |

### Grid Column Span

| クラス           | CSS                               |
| ---------------- | --------------------------------- |
| `.col-auto`      | `grid-column: auto;`              |
| `.col-span-1`    | `grid-column: span 1 / span 1;`   |
| `.col-span-2`    | `grid-column: span 2 / span 2;`   |
| `.col-span-3`    | `grid-column: span 3 / span 3;`   |
| `.col-span-4`    | `grid-column: span 4 / span 4;`   |
| `.col-span-5`    | `grid-column: span 5 / span 5;`   |
| `.col-span-6`    | `grid-column: span 6 / span 6;`   |
| `.col-span-7`    | `grid-column: span 7 / span 7;`   |
| `.col-span-8`    | `grid-column: span 8 / span 8;`   |
| `.col-span-9`    | `grid-column: span 9 / span 9;`   |
| `.col-span-10`   | `grid-column: span 10 / span 10;` |
| `.col-span-11`   | `grid-column: span 11 / span 11;` |
| `.col-span-12`   | `grid-column: span 12 / span 12;` |
| `.col-span-full` | `grid-column: 1 / -1;`            |

### Grid Row Span

| クラス           | CSS                          |
| ---------------- | ---------------------------- |
| `.row-auto`      | `grid-row: auto;`            |
| `.row-span-1`    | `grid-row: span 1 / span 1;` |
| `.row-span-2`    | `grid-row: span 2 / span 2;` |
| `.row-span-3`    | `grid-row: span 3 / span 3;` |
| `.row-span-4`    | `grid-row: span 4 / span 4;` |
| `.row-span-5`    | `grid-row: span 5 / span 5;` |
| `.row-span-6`    | `grid-row: span 6 / span 6;` |
| `.row-span-full` | `grid-row: 1 / -1;`          |

### Grid Position

| クラス           | 説明                        |
| ---------------- | --------------------------- |
| `.col-start-{n}` | カラム開始位置 (1-13, auto) |
| `.col-end-{n}`   | カラム終了位置 (1-13, auto) |
| `.row-start-{n}` | 行開始位置 (1-7, auto)      |
| `.row-end-{n}`   | 行終了位置 (1-7, auto)      |

### Grid Auto Flow

| クラス                 | CSS                             |
| ---------------------- | ------------------------------- |
| `.grid-flow-row`       | `grid-auto-flow: row;`          |
| `.grid-flow-col`       | `grid-auto-flow: column;`       |
| `.grid-flow-row-dense` | `grid-auto-flow: row dense;`    |
| `.grid-flow-col-dense` | `grid-auto-flow: column dense;` |

### Subgrid

| クラス          | CSS                                                                              |
| --------------- | -------------------------------------------------------------------------------- |
| `.subgrid-cols` | `display: subgrid; grid-template-columns: subgrid;`                              |
| `.subgrid-rows` | `display: subgrid; grid-template-rows: subgrid;`                                 |
| `.subgrid-both` | `display: subgrid; grid-template-columns: subgrid; grid-template-rows: subgrid;` |

## Width & Height

要素の幅と高さを制御するユーティリティクラス。

### Width

| クラス          | 説明         |
| --------------- | ------------ |
| `.w-{size}`     | 幅の設定     |
| `.min-w-{size}` | 最小幅の設定 |
| `.max-w-{size}` | 最大幅の設定 |

### Height

| クラス          | 説明           |
| --------------- | -------------- |
| `.h-{size}`     | 高さの設定     |
| `.min-h-{size}` | 最小高さの設定 |
| `.max-h-{size}` | 最大高さの設定 |

### 特殊な値

Width用の特殊な値:

| 値       | 説明                              |
| -------- | --------------------------------- |
| `full`   | `100%`                            |
| `auto`   | `auto`                            |
| `fit`    | `fit-content`                     |
| `min`    | `min-content`                     |
| `max`    | `max-content`                     |
| `screen` | `100vw`                           |
| `svh`    | `100svw` (Small viewport width)   |
| `lvh`    | `100lvw` (Large viewport width)   |
| `dvw`    | `100dvw` (Dynamic viewport width) |
| `cqw`    | `100cqw` (Container query width)  |
| `cqi`    | `100cqi` (Container query inline) |
| `cqmin`  | `100cqmin` (Container query min)  |
| `cqmax`  | `100cqmax` (Container query max)  |

Height用の特殊な値:

| 値       | 説明                               |
| -------- | ---------------------------------- |
| `full`   | `100%`                             |
| `auto`   | `auto`                             |
| `fit`    | `fit-content`                      |
| `min`    | `min-content`                      |
| `max`    | `max-content`                      |
| `screen` | `100vh`                            |
| `svh`    | `100svh` (Small viewport height)   |
| `lvh`    | `100lvh` (Large viewport height)   |
| `dvh`    | `100dvh` (Dynamic viewport height) |
| `cqw`    | `100cqh` (Container query height)  |
| `cqi`    | `100cqb` (Container query block)   |
| `cqmin`  | `100cqmin` (Container query min)   |
| `cqmax`  | `100cqmax` (Container query max)   |

### カスタム値

- `.w-[200px]` → `width: 200px;`
- `.h-[50vh]` → `height: 50vh;`
- `.max-w-[calc(100%-2rem)]` → `max-width: calc(100% - 2rem);`

## Positioning

要素の配置方法を制御するユーティリティクラス。

| クラス      | CSS                   |
| ----------- | --------------------- |
| `.static`   | `position: static;`   |
| `.fixed`    | `position: fixed;`    |
| `.absolute` | `position: absolute;` |
| `.relative` | `position: relative;` |
| `.sticky`   | `position: sticky;`   |

## Overflow

オーバーフローの処理方法を制御するユーティリティクラス。

### 全方向

| クラス              | CSS                  |
| ------------------- | -------------------- |
| `.overflow-auto`    | `overflow: auto;`    |
| `.overflow-hidden`  | `overflow: hidden;`  |
| `.overflow-visible` | `overflow: visible;` |
| `.overflow-scroll`  | `overflow: scroll;`  |
| `.overflow-clip`    | `overflow: clip;`    |

### X軸（水平方向）

| クラス                | CSS                    |
| --------------------- | ---------------------- |
| `.overflow-x-auto`    | `overflow-x: auto;`    |
| `.overflow-x-hidden`  | `overflow-x: hidden;`  |
| `.overflow-x-visible` | `overflow-x: visible;` |
| `.overflow-x-scroll`  | `overflow-x: scroll;`  |
| `.overflow-x-clip`    | `overflow-x: clip;`    |

### Y軸（垂直方向）

| クラス                | CSS                    |
| --------------------- | ---------------------- |
| `.overflow-y-auto`    | `overflow-y: auto;`    |
| `.overflow-y-hidden`  | `overflow-y: hidden;`  |
| `.overflow-y-visible` | `overflow-y: visible;` |
| `.overflow-y-scroll`  | `overflow-y: scroll;`  |
| `.overflow-y-clip`    | `overflow-y: clip;`    |

## Order

フレックスボックスやグリッドでの表示順序を制御するユーティリティクラス。

| クラス         | CSS             |
| -------------- | --------------- |
| `.order-1`     | `order: 1;`     |
| `.order-2`     | `order: 2;`     |
| `.order-3`     | `order: 3;`     |
| `.order-4`     | `order: 4;`     |
| `.order-5`     | `order: 5;`     |
| `.order-6`     | `order: 6;`     |
| `.order-7`     | `order: 7;`     |
| `.order-8`     | `order: 8;`     |
| `.order-9`     | `order: 9;`     |
| `.order-10`    | `order: 10;`    |
| `.order-11`    | `order: 11;`    |
| `.order-12`    | `order: 12;`    |
| `.order-first` | `order: -9999;` |
| `.order-last`  | `order: 9999;`  |
| `.order-none`  | `order: 0;`     |

### カスタム値

- `.order-[13]` → `order: 13;`
- `.order-[-1]` → `order: -1;`

## Z-Index

要素の重なり順を制御するユーティリティクラス。

| クラス    | CSS              |
| --------- | ---------------- |
| `.z-0`    | `z-index: 0;`    |
| `.z-10`   | `z-index: 10;`   |
| `.z-20`   | `z-index: 20;`   |
| `.z-30`   | `z-index: 30;`   |
| `.z-40`   | `z-index: 40;`   |
| `.z-50`   | `z-index: 50;`   |
| `.z-auto` | `z-index: auto;` |

### カスタム値

- `.z-[100]` → `z-index: 100;`
- `.z-[-1]` → `z-index: -1;`
- `.z-[var(--custom-z)]` → `z-index: var(--custom-z);`

## 使用例

### 基本的なレイアウト

```html
<!-- フレックスボックスレイアウト -->
<div class="flex justify-between items-center p-lg">
  <div class="w-[200px]">Left</div>
  <div class="flex-1 mx-md">Center</div>
  <div class="w-[200px]">Right</div>
</div>

<!-- グリッドレイアウト -->
<div class="grid grid-cols-3 gap-md">
  <div class="col-span-2">Main Content</div>
  <div>Sidebar</div>
</div>

<!-- スペーシングとポジション -->
<div class="relative p-xl m-[auto] max-w-[1200px]">
  <div class="absolute top-0 right-0 z-10">Badge</div>
  <div class="overflow-hidden h-[400px]">Content</div>
</div>
```

### レスポンシブデザイン（将来実装予定）

```html
<!-- モバイルファーストアプローチ -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-sm md:gap-md lg:gap-lg">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

## カスタマイズ

設定ファイルでテーマをカスタマイズできます：

```javascript
// smsshcss.config.js
module.exports = {
  theme: {
    spacing: {
      custom: '2.5rem',
      huge: '8rem',
    },
    width: {
      sidebar: '250px',
      content: '1024px',
    },
    zIndex: {
      modal: '1000',
      tooltip: '2000',
    },
  },
};
```

## パフォーマンスの最適化

### パージ機能

本番環境では未使用のクラスを自動的に削除します：

```javascript
// smsshcss.config.js
module.exports = {
  content: ['src/**/*.{html,js,ts,jsx,tsx}'],
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: ['src/**/*.{html,js,ts,jsx,tsx}'],
    safelist: [
      // 動的に生成されるクラスを保護
      /^m-/,
      /^p-/,
      /^gap-/,
    ],
  },
};
```

---

このリファレンスは随時更新されます。最新の情報は[API リファレンス](./API_REFERENCE.md)もご参照ください。
