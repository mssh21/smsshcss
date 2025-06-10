import { extractCustomSpacingClasses } from '../spacing';
import { extractCustomWidthClasses } from '../width';
import { extractCustomHeightClasses } from '../height';
import { extractCustomFlexClasses } from '../flexbox';

describe('Enhanced CSS Functions Support', () => {
  describe('calc() function', () => {
    it('should handle calc() with addition', () => {
      const content = '<div class="m-[calc(1rem+10px)]">Test</div>';
      const result = extractCustomSpacingClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe('.m-\\[calc\\(1rem\\+10px\\)\\] { margin: calc(1rem + 10px); }');
    });

    it('should handle calc() with subtraction', () => {
      const content = '<div class="p-[calc(100%-20px)]">Test</div>';
      const result = extractCustomSpacingClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe('.p-\\[calc\\(100\\%\\-20px\\)\\] { padding: calc(100% - 20px); }');
    });

    it('should handle calc() with multiplication', () => {
      const content = '<div class="mt-[calc(2rem*1.5)]">Test</div>';
      const result = extractCustomSpacingClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe('.mt-\\[calc\\(2rem\\*1\\.5\\)\\] { margin-top: calc(2rem * 1.5); }');
    });

    it('should handle calc() with division', () => {
      const content = '<div class="px-[calc(100vh/4)]">Test</div>';
      const result = extractCustomSpacingClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.px-\\[calc\\(100vh\\/4\\)\\] { padding-left: calc(100vh / 4); padding-right: calc(100vh / 4); }'
      );
    });

    it('should handle calc() with addition', () => {
      const content = '<div class="w-[calc(1rem+10px)]">Test</div>';
      const result = extractCustomWidthClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe('.w-\\[calc\\(1rem\\+10px\\)\\] { width: calc(1rem + 10px); }');
    });

    it('should handle calc() with subtraction', () => {
      const content = '<div class="min-w-[calc(100%-20px)]">Test</div>';
      const result = extractCustomWidthClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.min-w-\\[calc\\(100\\%\\-20px\\)\\] { min-width: calc(100% - 20px); }'
      );
    });

    it('should handle calc() with multiplication', () => {
      const content = '<div class="max-w-[calc(2rem*1.5)]">Test</div>';
      const result = extractCustomWidthClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.max-w-\\[calc\\(2rem\\*1\\.5\\)\\] { max-width: calc(2rem * 1.5); }'
      );
    });

    it('should handle calc() with basis', () => {
      const content = '<div class="basis-[calc(100%-20px)]">Test</div>';
      const result = extractCustomFlexClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.basis-\\[calc\\(100\\%\\-20px\\)\\] { flex-basis: calc(100% - 20px); }'
      );
    });
  });

  describe('min() function', () => {
    it('should handle min() with multiple values', () => {
      const content = '<div class="p-[min(1rem,3%,50px)]">Test</div>';
      const result = extractCustomSpacingClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.p-\\[min\\(1rem\\,3\\%\\,50px\\)\\] { padding: min(1rem, 3%, 50px); }'
      );
    });

    it('should handle min() with directional classes', () => {
      const content = '<div class="ml-[min(50px,10vw)]">Test</div>';
      const result = extractCustomSpacingClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe('.ml-\\[min\\(50px\\,10vw\\)\\] { margin-left: min(50px, 10vw); }');
    });

    it('should handle min() with two values', () => {
      const content = '<div class="w-[min(2rem,5vw)]">Test</div>';
      const result = extractCustomWidthClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe('.w-\\[min\\(2rem\\,5vw\\)\\] { width: min(2rem, 5vw); }');
    });

    it('should handle max() with basis', () => {
      const content = '<div class="basis-[max(100%-20px)]">Test</div>';
      const result = extractCustomFlexClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.basis-\\[max\\(100\\%\\-20px\\)\\] { flex-basis: max(100% - 20px); }'
      );
    });
  });

  describe('max() function', () => {
    it('should handle max() with two values', () => {
      const content = '<div class="m-[max(1rem,20px)]">Test</div>';
      const result = extractCustomSpacingClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe('.m-\\[max\\(1rem\\,20px\\)\\] { margin: max(1rem, 20px); }');
    });

    it('should handle max() with percentage and viewport units', () => {
      const content = '<div class="p-[max(0.5rem,1vw)]">Test</div>';
      const result = extractCustomSpacingClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe('.p-\\[max\\(0\\.5rem\\,1vw\\)\\] { padding: max(0.5rem, 1vw); }');
    });

    it('should handle max() with axis directions', () => {
      const content = '<div class="py-[max(1rem,2vh)]">Test</div>';
      const result = extractCustomSpacingClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.py-\\[max\\(1rem\\,2vh\\)\\] { padding-top: max(1rem, 2vh); padding-bottom: max(1rem, 2vh); }'
      );
    });

    it('should handle max() with two values', () => {
      const content = '<div class="min-w-[max(2rem,5vw)]">Test</div>';
      const result = extractCustomWidthClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe('.min-w-\\[max\\(2rem\\,5vw\\)\\] { min-width: max(2rem, 5vw); }');
    });

    it('should handle max() with basis', () => {
      const content = '<div class="basis-[max(100%-20px)]">Test</div>';
      const result = extractCustomFlexClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.basis-\\[max\\(100\\%\\-20px\\)\\] { flex-basis: max(100% - 20px); }'
      );
    });
  });

  describe('clamp() function', () => {
    it('should handle clamp() with three values', () => {
      const content = '<div class="m-[clamp(1rem,4vw,3rem)]">Test</div>';
      const result = extractCustomSpacingClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.m-\\[clamp\\(1rem\\,4vw\\,3rem\\)\\] { margin: clamp(1rem, 4vw, 3rem); }'
      );
    });

    it('should handle clamp() with complex values', () => {
      const content = '<div class="p-[clamp(0.5rem,2vw,2rem)]">Test</div>';
      const result = extractCustomSpacingClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.p-\\[clamp\\(0\\.5rem\\,2vw\\,2rem\\)\\] { padding: clamp(0.5rem, 2vw, 2rem); }'
      );
    });

    it('should handle clamp() with directional classes', () => {
      const content = '<div class="px-[clamp(1rem,5vw,4rem)]">Test</div>';
      const result = extractCustomSpacingClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.px-\\[clamp\\(1rem\\,5vw\\,4rem\\)\\] { padding-left: clamp(1rem, 5vw, 4rem); padding-right: clamp(1rem, 5vw, 4rem); }'
      );
    });

    it('should handle clamp() with two values', () => {
      const content = '<div class="max-w-[clamp(2rem,5vw,4rem)]">Test</div>';
      const result = extractCustomWidthClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.max-w-\\[clamp\\(2rem\\,5vw\\,4rem\\)\\] { max-width: clamp(2rem, 5vw, 4rem); }'
      );
    });

    it('should handle clamp() with basis', () => {
      const content = '<div class="basis-[clamp(100%-20px)]">Test</div>';
      const result = extractCustomFlexClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.basis-\\[clamp\\(100\\%\\-20px\\)\\] { flex-basis: clamp(100% - 20px); }'
      );
    });
  });

  describe('gap with CSS functions', () => {
    it('should handle gap with min()', () => {
      const content = '<div class="gap-[min(1rem,3vw)]">Test</div>';
      const result = extractCustomSpacingClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe('.gap-\\[min\\(1rem\\,3vw\\)\\] { gap: min(1rem, 3vw); }');
    });

    it('should handle gap-x with clamp()', () => {
      const content = '<div class="gap-x-[clamp(0.5rem,2vw,2rem)]">Test</div>';
      const result = extractCustomSpacingClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.gap-x-\\[clamp\\(0\\.5rem\\,2vw\\,2rem\\)\\] { column-gap: clamp(0.5rem, 2vw, 2rem); }'
      );
    });

    it('should handle gap-y with max()', () => {
      const content = '<div class="gap-y-[max(1rem,2vh)]">Test</div>';
      const result = extractCustomSpacingClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe('.gap-y-\\[max\\(1rem\\,2vh\\)\\] { row-gap: max(1rem, 2vh); }');
    });
  });

  describe('nested CSS functions', () => {
    it('should handle calc() with nested min()', () => {
      const content = '<div class="m-[calc(min(2rem,5vw)+10px)]">Test</div>';
      const result = extractCustomSpacingClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.m-\\[calc\\(min\\(2rem\\,5vw\\)\\+10px\\)\\] { margin: calc(min(2rem, 5vw) + 10px); }'
      );
    });

    it('should handle max() with nested calc() and clamp()', () => {
      const content = '<div class="p-[max(calc(1rem*2),clamp(1rem,3vw,2rem))]">Test</div>';
      const result = extractCustomSpacingClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.p-\\[max\\(calc\\(1rem\\*2\\)\\,clamp\\(1rem\\,3vw\\,2rem\\)\\)\\] { padding: max(calc(1rem * 2), clamp(1rem, 3vw, 2rem)); }'
      );
    });

    it('should handle clamp() with nested calc() functions', () => {
      const content = '<div class="mt-[clamp(calc(1rem+5px),4vw,calc(3rem-10px))]">Test</div>';
      const result = extractCustomSpacingClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.mt-\\[clamp\\(calc\\(1rem\\+5px\\)\\,4vw\\,calc\\(3rem\\-10px\\)\\)\\] { margin-top: clamp(calc(1rem + 5px), 4vw, calc(3rem - 10px)); }'
      );
    });

    it('should handle clamp() with two values', () => {
      const content = '<div class="w-[clamp(2rem,5vw,4rem)]">Test</div>';
      const result = extractCustomWidthClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.w-\\[clamp\\(2rem\\,5vw\\,4rem\\)\\] { width: clamp(2rem, 5vw, 4rem); }'
      );
    });

    it('should handle basis() with basis', () => {
      const content = '<div class="basis-[clamp(2rem,5vw,4rem)]">Test</div>';
      const result = extractCustomFlexClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.basis-\\[clamp\\(2rem\\,5vw\\,4rem\\)\\] { flex-basis: clamp(2rem, 5vw, 4rem); }'
      );
    });
  });

  describe('multiple CSS functions in one content', () => {
    it('should handle multiple different CSS functions', () => {
      const content = `
        <div class="m-[calc(1rem+10px)] p-[min(2rem,5vw)]">
          <span class="w-[max(100px,20%)] h-[clamp(50px,10vh,200px)] basis-[calc(100%-20px)]">Test</span>
        </div>
      `;
      const spacingResult = extractCustomSpacingClasses(content);
      const widthResult = extractCustomWidthClasses(content);
      const heightResult = extractCustomHeightClasses(content);
      const basisResult = extractCustomFlexClasses(content);

      expect(spacingResult).toHaveLength(2);
      expect(spacingResult).toContain(
        '.m-\\[calc\\(1rem\\+10px\\)\\] { margin: calc(1rem + 10px); }'
      );
      expect(spacingResult).toContain('.p-\\[min\\(2rem\\,5vw\\)\\] { padding: min(2rem, 5vw); }');

      expect(widthResult).toHaveLength(1);
      expect(widthResult).toContain('.w-\\[max\\(100px\\,20\\%\\)\\] { width: max(100px, 20%); }');

      expect(heightResult).toHaveLength(1);
      expect(heightResult).toContain(
        '.h-\\[clamp\\(50px\\,10vh\\,200px\\)\\] { height: clamp(50px, 10vh, 200px); }'
      );

      expect(basisResult).toHaveLength(1);
      expect(basisResult).toContain(
        '.basis-\\[calc\\(100\\%\\-20px\\)\\] { flex-basis: calc(100% - 20px); }'
      );
    });
  });
});
