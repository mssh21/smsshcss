# Configuration

SmsshCSS can be configured using a `smsshcss.config.js` file in the root of your project. This file allows you to customize every aspect of the framework, from your design system to the build process.

## Creating a Configuration File

To get started, you can copy the example configuration file from the `smsshcss` package:

```bash
cp node_modules/smsshcss/smsshcss.config.example.js smsshcss.config.js
```

## Configuration Options

### `content`

- **Type:** `Array<String>`
- **Default:** `[]`

An array of file paths or glob patterns that SmsshCSS will scan for utility classes. This is the most important option to configure, as it tells SmsshCSS where to look for your code.

```javascript
// smsshcss.config.js
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx,vue,svelte}', './public/index.html'],
};
```

### `apply`

- **Type:** `Object`
- **Default:** `{}`

A map of reusable component classes. The keys are the class names, and the values are the utility classes to apply.

```javascript
// smsshcss.config.js
module.exports = {
  apply: {
    btn: 'inline-block px-md py-sm',
    'btn-primary': 'btn bg-blue-500 text-white hover:bg-blue-600',
  },
};
```

### `purge`

- **Type:** `Object`
- **Default:** `{}`

Configuration for the CSS purging process, which removes unused styles in production.

- **`enabled`:** (Type: `Boolean`, Default: `process.env.NODE_ENV === 'production'`) - Whether to enable purging.
- **`content`:** (Type: `Array<String>`, Default: `[]`) - The files to scan for used classes. Defaults to the top-level `content` option.
- **`safelist`:** (Type: `Array<String | RegExp>`, Default: `[]`) - A list of classes or patterns that should not be purged, even if they are not found in the content files.
- **`blocklist`:** (Type: `Array<String | RegExp>`, Default: `[]`) - A list of classes or patterns that should always be purged.

```javascript
// smsshcss.config.js
module.exports = {
  purge: {
    enabled: true,
    safelist: [/^bg-/, 'my-dynamic-class'],
  },
};
```

### `includeResetCSS`

- **Type:** `Boolean`
- **Default:** `true`

Whether to include a CSS reset (based on modern-normalize) in the generated stylesheet.

### `includeBaseCSS`

- **Type:** `Boolean`
- **Default:** `true`

Whether to include base styles for common HTML elements.

### `minify`

- **Type:** `Boolean`
- **Default:** `false`

Whether to minify the generated CSS.

### `debug`

- **Type:** `Boolean`
- **Default:** `false`

Whether to enable debug mode, which provides more verbose output.

### `showPurgeReport`

- **Type:** `Boolean`
- **Default:** `false`

Whether to show a detailed report of the purging process after a production build.
