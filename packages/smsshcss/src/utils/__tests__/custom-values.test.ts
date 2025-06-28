import { describe, it, expect } from 'vitest';
import { extractCustomSpacingClasses } from '../spacing';
import { extractCustomWidthClasses } from '../width';
import { extractCustomHeightClasses } from '../height';
import { extractCustomFlexClasses } from '../flexbox';
import { extractCustomGridClasses } from '../grid';
import { extractCustomZIndexClasses } from '../z-index';
import { extractCustomOrderClasses } from '../order';
import { extractCustomColorClasses } from '../color';
import { extractCustomFontSizeClasses } from '../font-size';
import { customValueSamples } from '../../__tests__/setup';

describe('Custom Value Extraction Functions', () => {
  describe('extractCustomSpacingClasses', () => {
    describe('Basic Custom Values', () => {
      it('should extract margin custom values', () => {
        const content = '<div class="m-[20px] mt-[1rem] mx-[2em]">Test</div>';
        const result = extractCustomSpacingClasses(content);

        expect(result).toHaveLength(3);
        expect(result).toContain('.m-\\[20px\\] { margin: 20px; }');
        expect(result).toContain('.mt-\\[1rem\\] { margin-top: 1rem; }');
        expect(result).toContain('.mx-\\[2em\\] { margin-left: 2em; margin-right: 2em; }');
      });

      it('should extract padding custom values', () => {
        const content = '<div class="p-[15px] pt-[0.5rem] py-[3em]">Test</div>';
        const result = extractCustomSpacingClasses(content);

        expect(result).toHaveLength(3);
        expect(result).toContain('.p-\\[15px\\] { padding: 15px; }');
        expect(result).toContain('.pt-\\[0\\.5rem\\] { padding-top: 0.5rem; }');
        expect(result).toContain('.py-\\[3em\\] { padding-top: 3em; padding-bottom: 3em; }');
      });

      it('should extract gap custom values', () => {
        const content = '<div class="gap-[10px] gap-x-[1rem] gap-y-[2em]">Test</div>';
        const result = extractCustomSpacingClasses(content);

        expect(result).toHaveLength(3);
        expect(result).toContain('.gap-\\[10px\\] { gap: 10px; }');
        expect(result).toContain('.gap-x-\\[1rem\\] { column-gap: 1rem; }');
        expect(result).toContain('.gap-y-\\[2em\\] { row-gap: 2em; }');
      });
    });

    describe('Complex CSS Functions', () => {
      it('should extract calc() values correctly', () => {
        const content = '<div class="m-[calc(100%-20px)] p-[calc(2rem+10px)]">Test</div>';
        const result = extractCustomSpacingClasses(content);

        expect(result).toHaveLength(2);
        expect(result).toContain('.m-\\[calc\\(100\\%\\-20px\\)\\] { margin: calc(100% - 20px); }');
        expect(result).toContain('.p-\\[calc\\(2rem\\+10px\\)\\] { padding: calc(2rem + 10px); }');
      });

      it('should extract min() values correctly', () => {
        const content = '<div class="p-[min(2rem,5vw)] gap-[min(1rem,3%)]">Test</div>';
        const result = extractCustomSpacingClasses(content);

        expect(result).toHaveLength(2);
        expect(result).toContain('.p-\\[min\\(2rem\\,5vw\\)\\] { padding: min(2rem, 5vw); }');
        expect(result).toContain('.gap-\\[min\\(1rem\\,3\\%\\)\\] { gap: min(1rem, 3%); }');
      });

      it('should extract max() values correctly', () => {
        const content = '<div class="m-[max(1rem,20px)] gap-x-[max(0.5rem,1vw)]">Test</div>';
        const result = extractCustomSpacingClasses(content);

        expect(result).toHaveLength(2);
        expect(result).toContain('.m-\\[max\\(1rem\\,20px\\)\\] { margin: max(1rem, 20px); }');
        expect(result).toContain(
          '.gap-x-\\[max\\(0\\.5rem\\,1vw\\)\\] { column-gap: max(0.5rem, 1vw); }'
        );
      });

      it('should extract clamp() values correctly', () => {
        const content =
          '<div class="p-[clamp(1rem,4vw,3rem)] my-[clamp(0.5rem,2vw,2rem)]">Test</div>';
        const result = extractCustomSpacingClasses(content);

        expect(result).toHaveLength(2);
        expect(result).toContain(
          '.p-\\[clamp\\(1rem\\,4vw\\,3rem\\)\\] { padding: clamp(1rem, 4vw, 3rem); }'
        );
        expect(result).toContain(
          '.my-\\[clamp\\(0\\.5rem\\,2vw\\,2rem\\)\\] { margin-top: clamp(0.5rem, 2vw, 2rem); margin-bottom: clamp(0.5rem, 2vw, 2rem); }'
        );
      });
    });

    describe('CSS Variables', () => {
      it('should extract CSS variable values', () => {
        const content = '<div class="m-[var(--spacing)] p-[var(--padding-base)]">Test</div>';
        const result = extractCustomSpacingClasses(content);

        expect(result).toHaveLength(2);
        expect(result).toContain('.m-\\[var\\(--spacing\\)\\] { margin: var(--spacing); }');
        expect(result).toContain(
          '.p-\\[var\\(--padding-base\\)\\] { padding: var(--padding-base); }'
        );
      });
    });

    describe('Edge Cases', () => {
      it('should handle duplicate classes', () => {
        const content = '<div class="m-[20px] p-[20px] m-[20px]">Test</div>';
        const result = extractCustomSpacingClasses(content);

        // 実装では重複排除されていないため、3つのクラスが生成される
        expect(result).toHaveLength(3);
        expect(result).toContain('.m-\\[20px\\] { margin: 20px; }');
        expect(result).toContain('.p-\\[20px\\] { padding: 20px; }');
        // 重複したm-[20px]も含まれる
        expect(result.filter((r) => r.includes('margin: 20px')).length).toBe(2);
      });

      it('should handle complex nested CSS functions', () => {
        const content = '<div class="m-[calc(min(2rem,5vw)+10px)]">Test</div>';
        const result = extractCustomSpacingClasses(content);

        expect(result).toHaveLength(1);
        expect(result[0]).toContain('calc(min(2rem, 5vw) + 10px)');
      });

      it('should handle multiple values in one element', () => {
        const content = customValueSamples.spacing;
        const result = extractCustomSpacingClasses(content);

        expect(result.length).toBeGreaterThan(0);
        expect(result.some((r) => r.includes('margin: 20px'))).toBe(true);
        expect(result.some((r) => r.includes('padding: 1rem'))).toBe(true);
        expect(result.some((r) => r.includes('gap: 2em'))).toBe(true);
      });
    });
  });

  describe('extractCustomWidthClasses', () => {
    describe('Basic Width Values', () => {
      it('should extract width custom values', () => {
        const content = '<div class="w-[200px] w-[50%] w-[10rem]">Test</div>';
        const result = extractCustomWidthClasses(content);

        expect(result).toHaveLength(3);
        expect(result).toContain('.w-\\[200px\\] { width: 200px; }');
        expect(result).toContain('.w-\\[50\\%\\] { width: 50%; }');
        expect(result).toContain('.w-\\[10rem\\] { width: 10rem; }');
      });

      it('should extract min-width custom values', () => {
        const content = '<div class="min-w-[100px] min-w-[20%] min-w-[5rem]">Test</div>';
        const result = extractCustomWidthClasses(content);

        expect(result).toHaveLength(3);
        expect(result).toContain('.min-w-\\[100px\\] { min-width: 100px; }');
        expect(result).toContain('.min-w-\\[20\\%\\] { min-width: 20%; }');
        expect(result).toContain('.min-w-\\[5rem\\] { min-width: 5rem; }');
      });

      it('should extract max-width custom values', () => {
        const content = '<div class="max-w-[300px] max-w-[80%] max-w-[15rem]">Test</div>';
        const result = extractCustomWidthClasses(content);

        expect(result).toHaveLength(3);
        expect(result).toContain('.max-w-\\[300px\\] { max-width: 300px; }');
        expect(result).toContain('.max-w-\\[80\\%\\] { max-width: 80%; }');
        expect(result).toContain('.max-w-\\[15rem\\] { max-width: 15rem; }');
      });
    });

    describe('Complex Width Functions', () => {
      it('should extract calc() width values', () => {
        const content = '<div class="w-[calc(100%-40px)] min-w-[calc(50%+2rem)]">Test</div>';
        const result = extractCustomWidthClasses(content);

        expect(result).toHaveLength(2);
        expect(result).toContain('.w-\\[calc\\(100\\%\\-40px\\)\\] { width: calc(100% - 40px); }');
        expect(result).toContain(
          '.min-w-\\[calc\\(50\\%\\+2rem\\)\\] { min-width: calc(50% + 2rem); }'
        );
      });

      it('should extract clamp() width values', () => {
        const content = '<div class="w-[clamp(200px,50vw,800px)]">Test</div>';
        const result = extractCustomWidthClasses(content);

        expect(result).toHaveLength(1);
        expect(result).toContain(
          '.w-\\[clamp\\(200px\\,50vw\\,800px\\)\\] { width: clamp(200px, 50vw, 800px); }'
        );
      });

      it('should extract viewport units', () => {
        const content = '<div class="w-[50vw] w-[100vh] w-[25vmin] w-[75vmax]">Test</div>';
        const result = extractCustomWidthClasses(content);

        expect(result).toHaveLength(4);
        expect(result).toContain('.w-\\[50vw\\] { width: 50vw; }');
        expect(result).toContain('.w-\\[100vh\\] { width: 100vh; }');
        expect(result).toContain('.w-\\[25vmin\\] { width: 25vmin; }');
        expect(result).toContain('.w-\\[75vmax\\] { width: 75vmax; }');
      });
    });

    describe('CSS Variables and Complex Cases', () => {
      it('should extract CSS variable width values', () => {
        const content = '<div class="w-[var(--width)] min-w-[var(--min-width)]">Test</div>';
        const result = extractCustomWidthClasses(content);

        expect(result).toHaveLength(2);
        // CSS変数の場合、ハイフンはエスケープされない
        expect(result).toContain('.w-\\[var\\(--width\\)\\] { width: var(--width); }');
        expect(result).toContain(
          '.min-w-\\[var\\(--min-width\\)\\] { min-width: var(--min-width); }'
        );
      });

      it('should handle width samples from setup', () => {
        const result = extractCustomWidthClasses(customValueSamples.width);

        expect(result.length).toBeGreaterThan(0);
        expect(result.some((r) => r.includes('width: 100px'))).toBe(true);
        expect(result.some((r) => r.includes('min-width: 200px'))).toBe(true);
        expect(result.some((r) => r.includes('max-width: calc(100% - 40px)'))).toBe(true);
      });
    });

    describe('Edge Cases', () => {
      it('should handle duplicate width classes', () => {
        const content = '<div class="w-[200px] min-w-[200px] w-[200px]">Test</div>';
        const result = extractCustomWidthClasses(content);

        // 実装では重複排除されていないため、3つのクラスが生成される
        expect(result).toHaveLength(3);
        expect(result).toContain('.w-\\[200px\\] { width: 200px; }');
        expect(result).toContain('.min-w-\\[200px\\] { min-width: 200px; }');

        // w-[200px]が2回、min-w-[200px]が1回
        const widthClasses = result.filter((r) => r.includes('{ width: 200px; }'));
        const minWidthClasses = result.filter((r) => r.includes('{ min-width: 200px; }'));
        expect(widthClasses).toHaveLength(2);
        expect(minWidthClasses).toHaveLength(1);
      });

      it('should handle empty content', () => {
        const result = extractCustomWidthClasses('');
        expect(result).toHaveLength(0);
      });

      it('should handle content without custom values', () => {
        const content = '<div class="w-full max-w-md">Standard classes</div>';
        const result = extractCustomWidthClasses(content);
        expect(result).toHaveLength(0);
      });
    });
  });

  describe('extractCustomHeightClasses', () => {
    describe('Basic Height Values', () => {
      it('should extract height custom values', () => {
        const content = '<div class="h-[200px] h-[50%] h-[10rem]">Test</div>';
        const result = extractCustomHeightClasses(content);

        expect(result).toHaveLength(3);
        expect(result).toContain('.h-\\[200px\\] { height: 200px; }');
        expect(result).toContain('.h-\\[50\\%\\] { height: 50%; }');
        expect(result).toContain('.h-\\[10rem\\] { height: 10rem; }');
      });

      it('should extract min-height custom values', () => {
        const content = '<div class="min-h-[100px] min-h-[20%] min-h-[5rem]">Test</div>';
        const result = extractCustomHeightClasses(content);

        expect(result).toHaveLength(3);
        expect(result).toContain('.min-h-\\[100px\\] { min-height: 100px; }');
        expect(result).toContain('.min-h-\\[20\\%\\] { min-height: 20%; }');
        expect(result).toContain('.min-h-\\[5rem\\] { min-height: 5rem; }');
      });

      it('should extract max-height custom values', () => {
        const content = '<div class="max-h-[300px] max-h-[80%] max-h-[15rem]">Test</div>';
        const result = extractCustomHeightClasses(content);

        expect(result).toHaveLength(3);
        expect(result).toContain('.max-h-\\[300px\\] { max-height: 300px; }');
        expect(result).toContain('.max-h-\\[80\\%\\] { max-height: 80%; }');
        expect(result).toContain('.max-h-\\[15rem\\] { max-height: 15rem; }');
      });
    });

    describe('Complex Height Functions', () => {
      it('should extract calc() height values', () => {
        const content = '<div class="h-[calc(100%-40px)] min-h-[calc(50%+2rem)]">Test</div>';
        const result = extractCustomHeightClasses(content);

        expect(result).toHaveLength(2);
        expect(result).toContain('.h-\\[calc\\(100\\%\\-40px\\)\\] { height: calc(100% - 40px); }');
        expect(result).toContain(
          '.min-h-\\[calc\\(50\\%\\+2rem\\)\\] { min-height: calc(50% + 2rem); }'
        );
      });

      it('should extract clamp() height values', () => {
        const content = '<div class="h-[clamp(200px,50vw,800px)]">Test</div>';
        const result = extractCustomHeightClasses(content);

        expect(result).toHaveLength(1);
        expect(result).toContain(
          '.h-\\[clamp\\(200px\\,50vw\\,800px\\)\\] { height: clamp(200px, 50vw, 800px); }'
        );
      });

      it('should extract viewport units', () => {
        const content = '<div class="h-[50vh] h-[100vh] h-[25vmin] h-[75vmax]">Test</div>';
        const result = extractCustomHeightClasses(content);

        expect(result).toHaveLength(4);
        expect(result).toContain('.h-\\[50vh\\] { height: 50vh; }');
        expect(result).toContain('.h-\\[100vh\\] { height: 100vh; }');
        expect(result).toContain('.h-\\[25vmin\\] { height: 25vmin; }');
        expect(result).toContain('.h-\\[75vmax\\] { height: 75vmax; }');
      });
    });

    describe('CSS Variables and Complex Cases', () => {
      it('should extract CSS variable height values', () => {
        const content = '<div class="h-[var(--height)] min-h-[var(--min-height)]">Test</div>';
        const result = extractCustomHeightClasses(content);

        expect(result).toHaveLength(2);
        // CSS変数の場合、ハイフンはエスケープされない
        expect(result).toContain('.h-\\[var\\(--height\\)\\] { height: var(--height); }');
        expect(result).toContain(
          '.min-h-\\[var\\(--min-height\\)\\] { min-height: var(--min-height); }'
        );
      });

      it('should handle height samples from setup', () => {
        const result = extractCustomHeightClasses(customValueSamples.height);

        expect(result.length).toBeGreaterThan(0);
        expect(result.some((r) => r.includes('height: 100px'))).toBe(true);
        expect(result.some((r) => r.includes('min-height: 200px'))).toBe(true);
        expect(result.some((r) => r.includes('max-height: calc(100% - 40px)'))).toBe(true);
      });
    });

    describe('Edge Cases', () => {
      it('should handle duplicate height classes', () => {
        const content = '<div class="h-[200px] min-h-[200px] h-[200px]">Test</div>';
        const result = extractCustomHeightClasses(content);

        // 実装では重複排除されていないため、3つのクラスが生成される
        expect(result).toHaveLength(3);
        expect(result).toContain('.h-\\[200px\\] { height: 200px; }');
        expect(result).toContain('.min-h-\\[200px\\] { min-height: 200px; }');

        // w-[200px]が2回、min-w-[200px]が1回
        const heightClasses = result.filter((r) => r.includes('{ height: 200px; }'));
        const minHeightClasses = result.filter((r) => r.includes('{ min-height: 200px; }'));
        expect(heightClasses).toHaveLength(2);
        expect(minHeightClasses).toHaveLength(1);
      });

      it('should handle empty content', () => {
        const result = extractCustomHeightClasses('');
        expect(result).toHaveLength(0);
      });

      it('should handle content without custom values', () => {
        const content = '<div class="h-full max-h-md">Standard classes</div>';
        const result = extractCustomHeightClasses(content);
        expect(result).toHaveLength(0);
      });
    });
  });

  describe('extractCustomGridClasses', () => {
    describe('Basic Grid Custom Values', () => {
      it('should extract grid-cols custom values', () => {
        const content =
          '<div class="grid-cols-[80] grid-cols-[200px,1fr,100px] grid-cols-[20]">Test</div>';
        const result = extractCustomGridClasses(content);

        expect(result).toHaveLength(3);
        expect(result).toContain(
          '.grid-cols-\\[80\\] { grid-template-columns: repeat(80, minmax(0, 1fr)); }'
        );
        expect(result).toContain(
          '.grid-cols-\\[200px,1fr,100px\\] { grid-template-columns: 200px 1fr 100px; }'
        );
        expect(result).toContain(
          '.grid-cols-\\[20\\] { grid-template-columns: repeat(20, minmax(0, 1fr)); }'
        );
      });

      it('should extract grid-rows custom values', () => {
        const content =
          '<div class="grid-rows-[var(--grid-rows)] grid-rows-[auto,1fr,auto] grid-rows-[10]">Test</div>';
        const result = extractCustomGridClasses(content);

        expect(result).toHaveLength(3);
        expect(result).toContain(
          '.grid-rows-\\[var\\(--grid-rows\\)\\] { grid-template-rows: repeat(var(--grid-rows), minmax(0, 1fr)); }'
        );
        expect(result).toContain(
          '.grid-rows-\\[auto,1fr,auto\\] { grid-template-rows: auto 1fr auto; }'
        );
        expect(result).toContain(
          '.grid-rows-\\[10\\] { grid-template-rows: repeat(10, minmax(0, 1fr)); }'
        );
      });

      it('should extract span custom values', () => {
        const content =
          '<div class="col-span-[15] col-span-[var(--col-span)] row-span-[20] row-span-[var(--row-span)]">Test</div>';
        const result = extractCustomGridClasses(content);

        expect(result).toHaveLength(4);
        expect(result).toContain('.col-span-\\[15\\] { grid-column: span 15 / span 15; }');
        expect(result).toContain(
          '.col-span-\\[var\\(--col-span\\)\\] { grid-column: span var(--col-span) / span var(--col-span); }'
        );
        expect(result).toContain('.row-span-\\[20\\] { grid-row: span 20 / span 20; }');
        expect(result).toContain(
          '.row-span-\\[var\\(--row-span\\)\\] { grid-row: span var(--row-span) / span var(--row-span); }'
        );
      });

      it('should extract grid position custom values', () => {
        const content =
          '<div class="col-start-[5] col-start-[var(--col-start)] col-end-[10] col-end-[var(--col-end)] row-start-[2] row-start-[var(--row-start)] row-end-[4] row-end-[var(--row-end)]">Test</div>';
        const result = extractCustomGridClasses(content);

        expect(result).toHaveLength(8);
        expect(result).toContain('.col-start-\\[5\\] { grid-column-start: 5; }');
        expect(result).toContain(
          '.col-start-\\[var\\(--col-start\\)\\] { grid-column-start: var(--col-start); }'
        );
        expect(result).toContain('.col-end-\\[10\\] { grid-column-end: 10; }');
        expect(result).toContain(
          '.col-end-\\[var\\(--col-end\\)\\] { grid-column-end: var(--col-end); }'
        );
        expect(result).toContain('.row-start-\\[2\\] { grid-row-start: 2; }');
        expect(result).toContain(
          '.row-start-\\[var\\(--row-start\\)\\] { grid-row-start: var(--row-start); }'
        );
        expect(result).toContain('.row-end-\\[4\\] { grid-row-end: 4; }');
        expect(result).toContain(
          '.row-end-\\[var\\(--row-end\\)\\] { grid-row-end: var(--row-end); }'
        );
      });
    });

    describe('Complex Grid Values', () => {
      it('should extract CSS variable values', () => {
        const content = '<div class="grid-cols-[var(--columns)] row-span-[var(--span)]">Test</div>';
        const result = extractCustomGridClasses(content);

        expect(result).toHaveLength(2);
        expect(result).toContain(
          '.grid-cols-\\[var\\(--columns\\)\\] { grid-template-columns: repeat(var(--columns), minmax(0, 1fr)); }'
        );
        expect(result).toContain(
          '.row-span-\\[var\\(--span\\)\\] { grid-row: span var(--span) / span var(--span); }'
        );
      });

      it('should extract grid-cols with CSS variables', () => {
        const content =
          '<div class="grid-cols-[var(--columns)] row-span-[var(--span)] col-span-[var(--span)]">Test</div>';
        const result = extractCustomGridClasses(content);

        expect(result).toHaveLength(3);
        expect(result).toContain(
          '.grid-cols-\\[var\\(--columns\\)\\] { grid-template-columns: repeat(var(--columns), minmax(0, 1fr)); }'
        );
        expect(result).toContain(
          '.row-span-\\[var\\(--span\\)\\] { grid-row: span var(--span) / span var(--span); }'
        );
        expect(result).toContain(
          '.col-span-\\[var\\(--span\\)\\] { grid-column: span var(--span) / span var(--span); }'
        );
      });
    });

    describe('Edge Cases', () => {
      it('should handle duplicate classes', () => {
        const content = '<div class="grid-cols-[80] col-span-[80] grid-cols-[80]">Test</div>';
        const result = extractCustomGridClasses(content);

        // 実装では重複排除されていないため、3つのクラスが生成される
        expect(result).toHaveLength(3);
        expect(
          result.filter((r) => r.includes('grid-template-columns: repeat(80, minmax(0, 1fr))'))
            .length
        ).toBe(2);
        expect(result.filter((r) => r.includes('grid-column: span 80 / span 80')).length).toBe(1);
      });

      it('should handle empty content', () => {
        const result = extractCustomGridClasses('');
        expect(result).toHaveLength(0);
      });

      it('should handle content without grid classes', () => {
        const content = '<div class="text-red-500 p-4">Content</div>';
        const result = extractCustomGridClasses(content);
        expect(result).toHaveLength(0);
      });

      it('should handle malformed bracket classes', () => {
        const content = '<div class="grid-cols-[incomplete">Content</div>';
        const result = extractCustomGridClasses(content);
        expect(result).toHaveLength(0);
      });
    });
  });

  describe('extractCustomFlexClasses', () => {
    describe('CSS Functions', () => {
      it('should extract calc() with flex', () => {
        const content =
          '<div class="flex-[5] basis-[calc(100%-20px)] basis-[40px] shrink-[2] grow-[4]">Test</div>';
        const result = extractCustomFlexClasses(content);
        expect(result).toHaveLength(5);
        expect(result).toContain('.flex-\\[5\\] { flex: 5; }');
        expect(result).toContain(
          '.basis-\\[calc\\(100\\%\\-20px\\)\\] { flex-basis: calc(100% - 20px); }'
        );
        expect(result).toContain('.basis-\\[40px\\] { flex-basis: 40px; }');
        expect(result).toContain('.shrink-\\[2\\] { flex-shrink: 2; }');
        expect(result).toContain('.grow-\\[4\\] { flex-grow: 4; }');
      });
    });

    describe('Complex Flex Values', () => {
      it('should extract CSS variable values', () => {
        const content =
          '<div class="flex-[var(--flex)] basis-[var(--basis)] shrink-[var(--shrink)] grow-[var(--grow)]">Test</div>';
        const result = extractCustomFlexClasses(content);

        expect(result).toHaveLength(4);
        expect(result).toContain('.flex-\\[var\\(--flex\\)\\] { flex: var(--flex); }');
        expect(result).toContain('.basis-\\[var\\(--basis\\)\\] { flex-basis: var(--basis); }');
        expect(result).toContain('.shrink-\\[var\\(--shrink\\)\\] { flex-shrink: var(--shrink); }');
        expect(result).toContain('.grow-\\[var\\(--grow\\)\\] { flex-grow: var(--grow); }');
      });
    });

    describe('Edge Cases', () => {
      it('should handle empty content', () => {
        const result = extractCustomFlexClasses('');
        expect(result).toHaveLength(0);
      });

      it('should handle content without flex classes', () => {
        const content = '<div class="text-red-500 p-4">Content</div>';
        const result = extractCustomFlexClasses(content);
        expect(result).toHaveLength(0);
      });

      it('should handle malformed bracket classes', () => {
        const content = '<div class="flex-[incomplete">Content</div>';
        const result = extractCustomFlexClasses(content);
        expect(result).toHaveLength(0);
      });
    });
  });

  describe('extractCustomZIndexClasses', () => {
    describe('Basic Z-Index Custom Values', () => {
      it('should extract z-index custom values', () => {
        const content = '<div class="z-[1] z-[2] z-[3]">Test</div>';
        const result = extractCustomZIndexClasses(content);

        expect(result).toHaveLength(3);
        expect(result).toContain('.z-\\[1\\] { z-index: 1; }');
        expect(result).toContain('.z-\\[2\\] { z-index: 2; }');
        expect(result).toContain('.z-\\[3\\] { z-index: 3; }');
      });
    });
  });

  describe('extractCustomOrderClasses', () => {
    describe('Basic Order Values', () => {
      it('should extract order custom values', () => {
        const content = '<div class="order-[1] order-[2] order-[3]">Test</div>';
        const result = extractCustomOrderClasses(content);

        expect(result).toHaveLength(3);
        expect(result).toContain('.order-\\[1\\] { order: 1; }');
        expect(result).toContain('.order-\\[2\\] { order: 2; }');
        expect(result).toContain('.order-\\[3\\] { order: 3; }');
      });
    });
  });

  describe('extractCustomColorClasses', () => {
    it('should extract color custom values', () => {
      const content = '<div class="text-[var(--color)]">Test</div>';
      const result = extractCustomColorClasses(content);
      expect(result).toHaveLength(1);
      expect(result[0]).toBe('.text-\\[var\\(--color\\)\\] { color: var(--color); }');
    });

    it('should extract hex color custom values', () => {
      const content = '<div class="text-[#555555]">Test</div>';
      const result = extractCustomColorClasses(content);
      expect(result).toHaveLength(1);
      expect(result[0]).toBe('.text-\\[\\#555555\\] { color: #555555; }');
    });

    it('should extract multiple hex color values', () => {
      const content = '<div class="text-[#259270] text-[#ff0000] text-[#00ff00]">Test</div>';
      const result = extractCustomColorClasses(content);
      expect(result).toHaveLength(3);
      expect(result[0]).toBe('.text-\\[\\#259270\\] { color: #259270; }');
      expect(result[1]).toBe('.text-\\[\\#ff0000\\] { color: #ff0000; }');
      expect(result[2]).toBe('.text-\\[\\#00ff00\\] { color: #00ff00; }');
    });

    it('should extract rgb color values', () => {
      const content = '<div class="text-[rgb(149,11,218)]">Test</div>';
      const result = extractCustomColorClasses(content);
      expect(result).toHaveLength(1);
      expect(result[0]).toBe('.text-\\[rgb\\(149\\,11\\,218\\)\\] { color: rgb(149, 11, 218); }');
    });

    it('should extract hsl color values', () => {
      const content = '<div class="text-[hsl(210,100%,50%,1)]">Test</div>';
      const result = extractCustomColorClasses(content);
      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.text-\\[hsl\\(210\\,100\\%\\,50\\%\\,1\\)\\] { color: hsl(210, 100%, 50%, 1); }'
      );
    });
  });

  describe('extractCustomFontSizeClasses', () => {
    it('should extract font-size custom values', () => {
      const content = '<div class="font-size-[var(--font-size)]">Test</div>';
      const result = extractCustomFontSizeClasses(content);
      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.font-size-\\[var\\(--font-size\\)\\] { font-size: var(--font-size); }'
      );
    });
  });

  describe('Integration Tests', () => {
    it('should handle complex mixed custom values', () => {
      const complexContent = customValueSamples.complex;

      const spacingResult = extractCustomSpacingClasses(complexContent);
      const widthResult = extractCustomWidthClasses(complexContent);
      const fontSizeResult = extractCustomFontSizeClasses(complexContent);

      expect(spacingResult.length).toBeGreaterThan(0);
      expect(widthResult.length).toBeGreaterThan(0);
      expect(fontSizeResult.length).toBeGreaterThan(0);

      expect(spacingResult.some((r) => r.includes('clamp(1rem, 4vw, 3rem)'))).toBe(true);
      expect(spacingResult.some((r) => r.includes('max(20px, 2rem)'))).toBe(true);
      expect(widthResult.some((r) => r.includes('calc(50% - 10px)'))).toBe(true);
      expect(fontSizeResult.some((r) => r.includes('clamp(1rem, 4vw, 3rem)'))).toBe(true);
    });

    it('should maintain correct CSS selector escaping', () => {
      const content = '<div class="m-[calc(100%-20px)] w-[var(--width)]">Test</div>';

      const spacingResult = extractCustomSpacingClasses(content);
      const widthResult = extractCustomWidthClasses(content);

      // セレクターが正しくエスケープされていることを確認
      expect(spacingResult[0]).toBe(
        '.m-\\[calc\\(100\\%\\-20px\\)\\] { margin: calc(100% - 20px); }'
      );
      expect(widthResult[0]).toBe('.w-\\[var\\(--width\\)\\] { width: var(--width); }');
    });
  });
});
