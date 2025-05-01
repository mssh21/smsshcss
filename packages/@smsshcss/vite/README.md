# SMSSHCSS Vite Plugin

A Vite plugin for SMSSHCSS, a utility-first CSS framework.

## Installation

```bash
# npm
npm install smsshcss @smsshcss/vite --save-dev

# yarn
yarn add smsshcss @smsshcss/vite -D

# pnpm
pnpm add smsshcss @smsshcss/vite -D
```

## Usage

### 1. Initialize SMSSHCSS configuration

Run the CLI command to generate a configuration file:

```bash
npx smsshcss init
```

This will create a `smsshcss.config.js` file in your project root.

### 2. Configure Vite plugin

```js
// vite.config.js / vite.config.ts
import { defineConfig } from 'vite';
import smsshcss from '@smsshcss/vite';

export default defineConfig({
  plugins: [
    smsshcss(), // Will automatically load smsshcss.config.js or smsshcss.config.cjs
  ],
});
```

## Configuration

The plugin will automatically use your configuration file. You can use either ESM (`.js`) or CommonJS (`.cjs`) format:

### ESM format (smsshcss.config.js)

```js
export default {
  // Configuration options here...
};
```

### CommonJS format (smsshcss.config.cjs)

```js
/**
 * SmsshCSS 設定ファイル
 */
module.exports = {
  // スキャン対象のファイル
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // 常に含めるクラス
  safelist: [],
  // reset.cssを含めるかどうか (デフォルトはtrue)
  includeResetCSS: true,
  // base.cssを含めるかどうか (デフォルトはtrue)
  includeBaseCSS: true,
  // レガシーモードを無効化（@importが不要になります）
  legacyMode: false,
  // デバッグモード (オプション)
  debug: false,

  // テーマ設定 - トークンのカスタマイズ
  theme: {
    // カラーのカスタマイズ
    colors: {
      primary: '#3366FF',
      textPrimary: '#333333',
      backgroundBase: '#FFFFFF',
    },
    // フォントウェイトのカスタマイズ
    fontWeight: {
      normal: '400',
      bold: '700',
    },
    // フォントサイズのカスタマイズ
    fontSize: {
      base: '16px',
      xl: '24px',
      '2xl': '30px',
    },
    // 行の高さのカスタマイズ
    lineHeight: {
      normal: '1.5',
      relaxed: '1.75',
    },
    // スペーシングのカスタマイズ
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
    },
    // ボーダー半径のカスタマイズ
    borderRadius: {
      sm: '4px',
      md: '8px',
      lg: '12px',
    },
    // シャドウのカスタマイズ
    shadow: {
      sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
  },
};
```

### Plugin Options

| Option            | Type       | Default                                          | Description                                           |
| ----------------- | ---------- | ------------------------------------------------ | ----------------------------------------------------- |
| `content`         | `string[]` | `['./src/**/*.{html,js,jsx,ts,tsx,vue,svelte}']` | File patterns to scan for class names                 |
| `safelist`        | `string[]` | `[]`                                             | Classes to always include in the output CSS           |
| `includeResetCSS` | `boolean`  | `true`                                           | Whether to include the built-in reset.css             |
| `includeBaseCSS`  | `boolean`  | `true`                                           | Whether to include the built-in base.css              |
| `legacyMode`      | `boolean`  | `false`                                          | Legacy mode for compatibility                         |
| `debug`           | `boolean`  | `false`                                          | Enable debug logging                                  |
| `outputFile`      | `string`   | `'smsshcss.css'`                                 | Output CSS file name                                  |
| `customCSS`       | `string`   | `''`                                             | Custom CSS to be included at the end                  |
| `configFile`      | `string`   | `'smsshcss.config.js'`                           | Path to config file (relative to project root)        |
| `theme`           | `object`   | `{}`                                             | Theme customization options for colors, spacing, etc. |

## CSS Directives

You can use SMSSHCSS directives in your CSS files to include the generated styles:

```css
/* Import the reset and base styles */
@smsshcss base;

/* Import all utility classes */
@smsshcss utilities;

/* Or import everything with a single directive */
@smsshcss;

/* Your custom CSS */
body {
  /* ... */
}
```

## Reset CSS and Base Styles

The plugin includes a built-in reset CSS and base styles that provide a solid foundation for your project:

- **Reset CSS**: Normalizes browser styles for consistent rendering across different browsers
- **Base Styles**: Provides basic typography and element styling based on your theme config

If the external reset.css file cannot be found, the plugin automatically falls back to using its built-in version, ensuring your styles are always applied correctly.

## Debug Mode

For more detailed logging during development:

```js
// Standard debug mode
process.env.DEBUG = '1';

// Verbose debug mode (includes file path information)
process.env.DEBUG = 'verbose';
```

## How it works

This plugin scans your codebase for SMSSHCSS utility classes and generates a CSS file containing only the styles you're using. It integrates with Vite's dev server to automatically regenerate the CSS file when your files change.

## License

MIT
