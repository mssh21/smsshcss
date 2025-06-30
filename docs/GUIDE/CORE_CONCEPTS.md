# Core Concepts

This document explains the fundamental concepts behind SmsshCSS, including its design philosophy, the `apply` feature, and the Just-in-Time (JIT) compiler.

## Design Philosophy: Single Source of Truth

SmsshCSS is built around the idea of a **Single Source of Truth**. This means that all your design system's values—colors, spacing, fonts, etc.—are defined in a single configuration file. This approach offers several advantages:

- **Consistency:** Ensures a consistent look and feel across your entire application.
- **Maintainability:** Makes it easy to update your design system, as you only need to change values in one place.
- **Scalability:** Helps you build large, complex applications without sacrificing design consistency.

## The `apply` Feature: Reusable Component Classes

The `apply` feature is a powerful tool that allows you to create reusable component classes by combining existing utility classes. This is similar to Tailwind CSS's `@apply` directive, but it's defined directly in your configuration file.

### Example

Instead of writing the same long string of utility classes every time you create a button, you can define a `btn-primary` class in your configuration:

```javascript
// smsshcss.config.js
module.exports = {
  apply: {
    btn: 'inline-block px-md py-sm -md cursor-pointer',
    'btn-primary': 'btn bg-blue-500 text-white hover:bg-blue-600',
  },
};
```

Now, you can simply use the `btn-primary` class in your HTML:

```html
<button class="btn-primary">Click me</button>
```

This approach keeps your HTML clean and makes it easy to maintain a consistent design system.

## Just-in-Time (JIT) Compiler and Purging

SmsshCSS uses a Just-in-Time (JIT) compiler to generate your CSS on-demand. This means that it only generates the CSS for the utility classes you actually use in your code.

When you build for production, SmsshCSS automatically purges any unused CSS. This results in a highly optimized, small CSS file that only contains the styles you need.

### How it Works

1.  **Scanning:** SmsshCSS scans your `content` files (HTML, JavaScript, etc.) for utility classes.
2.  **Generating:** It generates the corresponding CSS for those classes.
3.  **Purging (Production):** In a production build, it removes any CSS that isn't used in your `content` files.

This process ensures that your final CSS bundle is as small as possible, which is crucial for web performance.
