# Utility Class Reference

This document provides a comprehensive reference for all the utility classes available in SmsshCSS. All utilities are designed to be intuitive, powerful, and fully customizable.

## Spacing

Control the margin, padding, and gap between elements.

- **Properties:** `margin`, `padding`, `gap`
- **Classes:** `m`, `p`, `gap`
- **Directions:** `t`, `r`, `b`, `l`, `x`, `y`
- **Arbitrary Values:** Supported

### Fibonacci Spacing System

SmsshCSS uses a spacing system based on the Fibonacci sequence to create natural and visually harmonious layouts. The base unit is `4px`.

| Token | Value (rem) | Value (px) |
| :---- | :---------- | :--------- |
| `2xs` | `0.25rem`   | `4px`      |
| `xs`  | `0.5rem`    | `8px`      |
| `sm`  | `0.75rem`   | `12px`     |
| `md`  | `1.25rem`   | `20px`     |
| `lg`  | `2rem`      | `32px`     |
| `xl`  | `3.25rem`   | `52px`     |
| `2xl` | `5.25rem`   | `84px`     |

### Examples

```html
<!-- Margin -->
<div class="m-md">...</div>
<div class="mt-lg">...</div>
<div class="mx-auto">...</div>

<!-- Padding -->
<div class="p-lg">...</div>
<div class="py-sm">...</div>

<!-- Gap -->
<div class="flex gap-md">...</div>

<!-- Arbitrary Values -->
<div class="m-[20px]">...</div>
<div class="p-[clamp(1rem,4vw,3rem)]">...</div>
```

## Sizing

Set the width and height of elements.

- **Properties:** `width`, `height`, `min-width`, `min-height`, `max-width`, `max-height`
- **Classes:** `w`, `h`, `min-w`, `min-h`, `max-w`, `max-h`
- **Arbitrary Values:** Supported

### Predefined Sizes

| Value    | CSS           |
| :------- | :------------ |
| `full`   | `100%`        |
| `screen` | `100vw/100vh` |
| `auto`   | `auto`        |
| `fit`    | `fit-content` |
| `min`    | `min-content` |
| `max`    | `max-content` |

### Examples

```html
<div class="w-full h-screen">...</div>
<div class="w-1/2">...</div>
<div class="max-w-lg">...</div>
<div class="h-[calc(100vh-4rem)]">...</div>
```

## Display

Control the display behavior of elements.

- **Property:** `display`
- **Classes:** `block`, `inline-block`, `inline`, `flex`, `inline-flex`, `grid`, `inline-grid`, `hidden`, `contents`, `flow-root`, `table`, `table-cell`, `table-row`

### Example

```html
<div class="hidden md:block">...</div>
```

## Flexbox

Control flexbox layouts.

- **Properties:** `flex-direction`, `flex-wrap`, `justify-content`, `align-items`, `align-content`, `align-self`, `flex-grow`, `flex-shrink`, `flex-basis`
- **Arbitrary Values:** Supported for `grow`, `shrink`, and `basis`

### Key Utilities

- **Direction:** `flex-row`, `flex-col`, `flex-row-reverse`, `flex-col-reverse`
- **Wrapping:** `flex-wrap`, `flex-nowrap`, `flex-wrap-reverse`
- **Justify Content:** `justify-start`, `justify-end`, `justify-center`, `justify-between`, `justify-around`, `justify-evenly`
- **Align Items:** `items-start`, `items-end`, `items-center`, `items-baseline`, `items-stretch`

### Example

```html
<div class="flex justify-center items-center">...</div>
```

## Grid

Control grid layouts.

- **Properties:** `grid-template-columns`, `grid-template-rows`, `grid-column`, `grid-row`, `grid-auto-flow`
- **Arbitrary Values:** Supported

### Key Utilities

- **Columns:** `grid-cols-1` to `grid-cols-12`
- **Rows:** `grid-rows-1` to `grid-rows-6`
- **Column Span:** `col-span-1` to `col-span-12`, `col-span-full`
- **Row Span:** `row-span-1` to `row-span-6`, `row-span-full`

### Example

```html
<div class="grid grid-cols-3 gap-md">
  <div class="col-span-2">...</div>
  <div>...</div>
</div>
```

## Positioning

Control the positioning of elements.

- **Property:** `position`
- **Classes:** `static`, `relative`, `absolute`, `fixed`, `sticky`
- **Coordinates:** `top`, `right`, `bottom`, `left`, `inset`
- **Arbitrary Values:** Supported for coordinates

### Example

```html
<div class="relative">
  <div class="absolute top-0 right-0">...</div>
</div>
```

## Z-Index

Control the stack order of elements.

- **Property:** `z-index`
- **Classes:** `z-0`, `z-10`, `z-20`, `z-30`, `z-40`, `z-50`, `z-auto`
- **Arbitrary Values:** Supported

### Example

```html
<div class="relative z-10">...</div>
```

## Overflow

Control how content overflows an element's box.

- **Property:** `overflow`
- **Classes:** `overflow-auto`, `overflow-hidden`, `overflow-visible`, `overflow-scroll`, `overflow-clip`
- **Directions:** `x`, `y`

### Example

```html
<div class="overflow-y-auto h-64">...</div>
```

## Order

Control the order of flex and grid items.

- **Property:** `order`
- **Classes:** `order-1` to `order-12`, `order-first`, `order-last`, `order-none`
- **Arbitrary Values:** Supported

### Example

```html
<div class="flex">
  <div class="order-2">First</div>
  <div class="order-1">Second</div>
</div>
```

## Color

Set the text, background, and border colors of elements.

- **Properties:** `color`, `background-color`, `border-color`
- **Classes:** `text`, `bg`, `border`
- **Arbitrary Values:** Supported

### Example

```html
<div class="text-blue-500 bg-gray-100 border-gray-300">...</div>
<div class="bg-[#ff0000]">...</div>
```

## Font Size

Control the font size of text.

- **Property:** `font-size`
- **Classes:** `text`
- **Arbitrary Values:** Supported

### Predefined Sizes

| Token  | Value (rem) |
| :----- | :---------- |
| `xs`   | `0.75rem`   |
| `sm`   | `0.875rem`  |
| `base` | `1rem`      |
| `lg`   | `1.125rem`  |
| `xl`   | `1.25rem`   |
| `2xl`  | `1.5rem`    |

### Example

```html
<p class="text-lg">...</p>
<p class="text-[1.1rem]">...</p>
```
