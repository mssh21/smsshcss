# SmsshCSS - A Lightweight, Utility-First CSS Framework

**SmsshCSS** is a high-performance, utility-first CSS framework that emphasizes type safety and an excellent developer experience. It provides an optimized CSS file by generating only the classes used in your HTML.

## Key Features

- **🚀 High Performance:** Millisecond-level processing speed with a Just-in-Time (JIT) compiler and a high-speed caching system.
- **🛡️ Type-Safe:** Full type support with TypeScript and strict validation.
- **⚡ Intuitive:** A utility-first design with reusable classes.
- **🎯 Optimized:** Generates a minimal CSS file containing only the classes you use.
- **🔧 Flexible:** Fully customizable through a configuration file.
- **📦 Integrated:** Supports Vite through an official plugin.
- **🎨 Composable:** Define reusable component classes with the `apply` feature.

## Getting Started

Get up and running with SmsshCSS in just a few minutes.

### Installation

```bash
# npm
npm install smsshcss @smsshcss/vite

# yarn
yarn add smsshcss @smsshcss/vite

# pnpm
pnpm add smsshcss @smsshcss/vite
```

### Quick Start with Vite

1.  **Add the plugin to your `vite.config.js`:**

    ```javascript
    import { defineConfig } from 'vite';
    import smsshcss from '@smsshcss/vite';

    export default defineConfig({
      plugins: [
        smsshcss({
          content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
        }),
      ],
    });
    ```

2.  **Start using utility classes in your HTML:**

    ```html
    <button class="px-md py-sm bg-blue-500 text-white -md hover:bg-blue-700">Click me</button>
    ```

## Documentation

For a deep dive into the features and capabilities of SmsshCSS, check out our comprehensive documentation:

**[Explore the full documentation](./docs/README.md)**

## Core Concepts

- **Utility-First:** Build complex designs by composing simple, single-purpose utility classes.
- **Just-in-Time Compilation:** SmsshCSS generates your CSS on-demand, resulting in a highly optimized and minimal stylesheet.
- **`apply` Feature:** Create reusable component classes by combining existing utilities in your configuration file.

## Contributing

We welcome contributions of all kinds! Please read our **[Contributing Guide](./docs/INTERNAL/CONTRIBUTING.md)** to get started.

## License

SmsshCSS is licensed under the [MIT License](LICENSE).
