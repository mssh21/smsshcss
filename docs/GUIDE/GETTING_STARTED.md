# Getting Started with SmsshCSS

Welcome to SmsshCSS! This guide will walk you through the initial setup and basic usage of the framework.

## Installation

You can install SmsshCSS and the official Vite plugin using your preferred package manager:

```bash
# npm
npm install smsshcss @smsshcss/vite

# yarn
yarn add smsshcss @smsshcss/vite

# pnpm
pnpm add smsshcss @smsshcss/vite
```

## Quick Start with Vite

The easiest way to get started is by using the Vite plugin.

### 1. Configure Vite

Add the `smsshcss` plugin to your `vite.config.js` file:

```javascript
import { defineConfig } from 'vite';
import smsshcss from '@smsshcss/vite';

export default defineConfig({
  plugins: [
    smsshcss({
      // Specify the files to scan for utility classes
      content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    }),
  ],
});
```

### 2. Create your HTML

Create an `index.html` file and add some utility classes:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SmsshCSS Example</title>
    <!-- The Vite plugin will automatically inject the generated CSS here -->
  </head>
  <body>
    <div class="p-lg bg-gray-100">
      <h1 class="text-2xl font-bold text-blue-600">Hello, SmsshCSS!</h1>
      <p class="mt-md">This is a simple example of using utility classes.</p>
      <button class="mt-lg px-md py-sm bg-blue-500 text-white hover:bg-blue-700">
        Get Started
      </button>
    </div>
  </body>
</html>
```

### 3. Run the development server

Start the Vite development server:

```bash
npm run dev
```

Vite will now watch your files, and SmsshCSS will generate the necessary CSS on-the-fly.

## Next Steps

Now that you have a basic setup, you can explore more advanced features:

- **Core Concepts:** Learn about the fundamental ideas behind SmsshCSS, such as the `apply` feature and purging.
- **Configuration:** Customize the framework to your needs by modifying the configuration file.
- **Utility Classes:** Browse the full list of available utility classes.
