# Contributing to SmsshCSS

Thank you for your interest in contributing to SmsshCSS! We welcome all contributions, from bug reports to new features.

## Getting Started

### Prerequisites

- Node.js v20.18.0 or higher
- Yarn v4.5.0 or pnpm (recommended)

### Setup

1.  **Fork and clone the repository:**

    ```bash
    git clone https://github.com/<your-username>/smsshcss.git
    cd smsshcss
    ```

2.  **Install dependencies:**

    ```bash
    yarn install
    # or
    pnpm install
    ```

3.  **Start the development server:**

    ```bash
    yarn dev
    # or
    pnpm dev
    ```

## Adding a New Utility

We recommend using the built-in script to generate new utilities.

### 1. Generate the Utility

Run the `generate:utility` script with the necessary options:

```bash
# Example: Generate a 'border-width' utility
node scripts/generate-utility.js border \
  --css-property=border-width \
  --prefix=border \
  --config-type=SizeConfig \
  --config-file=sizeConfig
```

This will create the utility file (e.g., `packages/smsshcss/src/utils/border.ts`) and a corresponding test file.

### 2. Integrate the New Utility

After generating the files, you'll need to integrate them into the system:

1.  **Export from `index.ts`:** Add an export statement to `packages/smsshcss/src/utils/index.ts`.
2.  **Add to `generator.ts`:** Import the new utility in `packages/smsshcss/src/core/generator.ts` and add it to the `utilities` array.
3.  **Create an `apply` plugin:** Add a new plugin in `packages/smsshcss/src/utils/apply-plugins/`.

### 3. Write Tests

Comprehensive tests are crucial for maintaining the quality and stability of SmsshCSS. When adding a new utility or feature, ensure you write tests that cover all possible use cases and edge cases.

Test files are typically generated alongside the utility files (e.g., `packages/smsshcss/src/utils/__tests__/border.test.ts`).

#### Basic Test Example

Tests are written using Vitest. A common pattern is to assert that the generated CSS contains the expected output for a given utility class.

```typescript
// packages/smsshcss/src/utils/__tests__/color.test.ts (Example)
import { describe, it, expect } from 'vitest';
import { generateColorClasses } from '../color';

describe('Color Utility Classes', () => {
  it('should generate correct text color classes', () => {
    const css = generateColorClasses();
    expect(css).toContain('.text-red-500 { color: hsl(0 100% 50% / 1); }');
    expect(css).toContain('.text-blue-500 { color: hsl(240 100% 50% / 1); }');
  });

  it('should generate correct background color classes', () => {
    const css = generateColorClasses();
    expect(css).toContain('.bg-green-500 { background-color: hsl(120 100% 50% / 1); }');
  });

  // Add more tests for arbitrary values, edge cases, etc.
});
```

#### Running Tests

```bash
# Run all tests
yarn test

# Run tests for a specific utility (e.g., color)
yarn test color

# Run tests in watch mode
yarn test:watch
```

### 4. Verify with Vite Playground

The `playground/vite-plugin` directory serves as a live development environment to verify your changes in a browser. Any changes made in the core `smsshcss` package are automatically reflected here due to the monorepo setup.

1.  **Navigate to the playground:**

    ```bash
    cd playground/vite-plugin
    ```

2.  **Start the development server:**

    ```bash
    yarn dev
    ```

3.  **Add your new utility class to an HTML file:**

    Open any HTML file in the `playground/vite-plugin` directory (e.g., `index.html`) and add the new utility class you've implemented.

    ```html
    <!-- Example: If you added a new 'text-purple-500' class -->
    <p class="text-purple-500">This text should be purple.</p>
    ```

4.  **Observe in browser:**

    Open your browser to the address provided by Vite and verify that the new utility class is correctly applied and styled as expected.

## Commit Conventions

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. This allows us to automatically generate changelogs and manage releases.

### Commit Message Format

Each commit message consists of a **header**, a **body**, and a **footer**.

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

- **Type:** `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revaert`, `style`, `test`,
- **Scope:** The part of the codebase that is affected (e.g., `generator`, `utils`, `docs`)
- **Subject:** A short, imperative-tense description of the change.

### Examples

- `feat(utils): add border-width utility`
- `fix(generator): improve error handling for arbitrary values`
- `docs(readme): update installation guide`

## Submitting a Pull Request

1.  Create a new branch for your feature or bug fix.
2.  Make your changes and commit them, following the commit conventions.
3.  Push your branch to your fork.
4.  Open a pull request to the `master` branch of the original repository.

Thank you for contributing to SmsshCSS!
