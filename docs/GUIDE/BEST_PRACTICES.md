# Best Practices

This guide provides best practices for using SmsshCSS effectively, including tips for performance optimization and recommendations for production environments.

## Core Principles

### 1. Embrace the Fibonacci Spacing System

SmsshCSS uses a spacing system based on the Fibonacci sequence. This creates a natural and visually pleasing rhythm in your designs. Whenever possible, use the predefined spacing tokens (e.g., `p-md`, `m-lg`) instead of arbitrary values.

**Do:**

```html
<div class="p-md m-lg gap-sm">
  <h1 class="mb-md">Title</h1>
  <p class="px-lg py-sm">Content</p>
</div>
```

**Don't:**

```html
<div class="p-[17px] m-[23px] gap-[14px]">...</div>
```

### 2. Componentize with the `apply` Feature

For frequently used combinations of utility classes, use the `apply` feature to create reusable component classes. This keeps your HTML clean and your design system consistent.

**Do:**

```javascript
// smsshcss.config.js
apply: {
  'card': 'p-lg bg-white border border-gray-200 -md',
  'btn-primary': 'px-lg py-md bg-blue-500 text-white -sm',
}
```

**Don't:**

```html
<div class="p-lg bg-white border border-gray-200 -md">...</div>
<div class="p-lg bg-white border border-gray-200 -md">...</div>
```

### 3. Use a Consistent Naming Convention

When creating component classes with `apply`, we recommend a BEM-like naming convention to keep your styles organized and predictable.

**Do:**

```javascript
apply: {
  'card': 'p-md -lg border',
  'card__header': 'pb-sm mb-sm border-b',
  'card__body': 'py-sm',

  'btn': 'inline-block px-md py-sm',
  'btn--primary': 'btn bg-blue-500 text-white',
}
```

**Don't:**

```javascript
apply: {
  'Card': 'p-md',
  'cardHeader': 'pb-sm mb-sm',
}
```

### 4. Compose Components

Design your component classes to be composable. Start with small, single-purpose classes and combine them to create more complex components.

**Do:**

```javascript
apply: {
  'surface': 'bg-white -lg shadow-sm',
  'interactive': 'cursor-pointer transition-colors',
  'spacing-md': 'p-md',

  'card': 'surface spacing-md',
  'clickable-card': 'card interactive hover:shadow-md',
}
```

**Don't:**

```javascript
apply: {
  'card': 'bg-white -lg shadow-sm p-md',
  'clickable-card': 'bg-white -lg shadow-md p-md cursor-pointer transition-colors',
}
```

## Performance Optimization

### 1. Optimize Your Purge Configuration

For production builds, make sure your `purge` configuration is set up correctly to remove all unused CSS.

```javascript
// smsshcss.config.js
purge: {
  enabled: process.env.NODE_ENV === 'production',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  safelist: [
    // Classes that are generated dynamically
    /^hover:/,
    /^focus:/,
  ],
}
```

### 2. Use Arbitrary Values Sparingly

While arbitrary values are powerful, they can lead to a larger CSS file if overused. Stick to the predefined design tokens whenever possible.

## Team Development

### 1. Share a Configuration File

Place a `smsshcss.config.js` file at the root of your project to ensure that all team members are using the same settings.

### 2. Establish a Style Guide

Create a style guide that documents your component classes and provides examples of how to use them. This will help to ensure consistency across your application.
