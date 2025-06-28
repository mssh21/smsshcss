import { extractCustomSpacingClasses } from '../spacing';
import { extractCustomWidthClasses } from '../width';
import { extractCustomHeightClasses } from '../height';
import { extractCustomFlexClasses } from '../flexbox';
import { extractCustomColorClasses } from '../color';
import { extractCustomFontSizeClasses } from '../font-size';

describe('Enhanced CSS Functions Support', () => {
  describe('calc() function', () => {
    it('should handle calc() with addition', () => {
      const content =
        '<div class="m-[calc(1rem+10px)] mx-[calc(1rem+10px)] my-[calc(1rem+10px)] mr-[calc(1rem+10px)] ml-[calc(1rem+10px)] mt-[calc(1rem+10px)] mb-[calc(1rem+10px)] m-[calc((1rem+10px)/2)]">Test</div>';
      const result = extractCustomSpacingClasses(content);

      expect(result).toHaveLength(8);
      expect(result[0]).toBe('.m-\\[calc\\(1rem\\+10px\\)\\] { margin: calc(1rem + 10px); }');
      expect(result[1]).toBe(
        '.mx-\\[calc\\(1rem\\+10px\\)\\] { margin-left: calc(1rem + 10px); margin-right: calc(1rem + 10px); }'
      );
      expect(result[2]).toBe(
        '.my-\\[calc\\(1rem\\+10px\\)\\] { margin-top: calc(1rem + 10px); margin-bottom: calc(1rem + 10px); }'
      );
      expect(result[3]).toBe(
        '.mr-\\[calc\\(1rem\\+10px\\)\\] { margin-right: calc(1rem + 10px); }'
      );
      expect(result[4]).toBe('.ml-\\[calc\\(1rem\\+10px\\)\\] { margin-left: calc(1rem + 10px); }');
      expect(result[5]).toBe('.mt-\\[calc\\(1rem\\+10px\\)\\] { margin-top: calc(1rem + 10px); }');
      expect(result[6]).toBe(
        '.mb-\\[calc\\(1rem\\+10px\\)\\] { margin-bottom: calc(1rem + 10px); }'
      );
      expect(result[7]).toBe(
        '.m-\\[calc\\(\\(1rem\\+10px\\)\\/2\\)\\] { margin: calc((1rem + 10px) / 2); }'
      );
    });

    it('should handle calc() with subtraction', () => {
      const content =
        '<div class="p-[calc(100%-20px)] px-[calc(100%-20px)] py-[calc(100%-20px)] pr-[calc(100%-20px)] pl-[calc(100%-20px)] pt-[calc(100%-20px)] pb-[calc(100%-20px)] p-[calc((100%-20px)*2)]">Test</div>';
      const result = extractCustomSpacingClasses(content);

      expect(result).toHaveLength(8);
      expect(result[0]).toBe('.p-\\[calc\\(100\\%\\-20px\\)\\] { padding: calc(100% - 20px); }');
      expect(result[1]).toBe(
        '.px-\\[calc\\(100\\%\\-20px\\)\\] { padding-left: calc(100% - 20px); padding-right: calc(100% - 20px); }'
      );
      expect(result[2]).toBe(
        '.py-\\[calc\\(100\\%\\-20px\\)\\] { padding-top: calc(100% - 20px); padding-bottom: calc(100% - 20px); }'
      );
      expect(result[3]).toBe(
        '.pr-\\[calc\\(100\\%\\-20px\\)\\] { padding-right: calc(100% - 20px); }'
      );
      expect(result[4]).toBe(
        '.pl-\\[calc\\(100\\%\\-20px\\)\\] { padding-left: calc(100% - 20px); }'
      );
      expect(result[5]).toBe(
        '.pt-\\[calc\\(100\\%\\-20px\\)\\] { padding-top: calc(100% - 20px); }'
      );
      expect(result[6]).toBe(
        '.pb-\\[calc\\(100\\%\\-20px\\)\\] { padding-bottom: calc(100% - 20px); }'
      );
      expect(result[7]).toBe(
        '.p-\\[calc\\(\\(100\\%\\-20px\\)\\*2\\)\\] { padding: calc((100% - 20px) * 2); }'
      );
    });

    it('should handle calc() with addition', () => {
      const content = '<div class="w-[calc(1rem+10px)] w-[calc((1rem+10px)*2)]">Test</div>';
      const result = extractCustomWidthClasses(content);

      expect(result).toHaveLength(2);
      expect(result[0]).toBe('.w-\\[calc\\(1rem\\+10px\\)\\] { width: calc(1rem + 10px); }');
      expect(result[1]).toBe(
        '.w-\\[calc\\(\\(1rem\\+10px\\)\\*2\\)\\] { width: calc((1rem + 10px) * 2); }'
      );
    });

    it('should handle calc() with subtraction', () => {
      const content = '<div class="min-w-[calc(100%-20px)] min-w-[calc((100%-20px)/2)]">Test</div>';
      const result = extractCustomWidthClasses(content);

      expect(result).toHaveLength(2);
      expect(result[0]).toBe(
        '.min-w-\\[calc\\(100\\%\\-20px\\)\\] { min-width: calc(100% - 20px); }'
      );
      expect(result[1]).toBe(
        '.min-w-\\[calc\\(\\(100\\%\\-20px\\)\\/2\\)\\] { min-width: calc((100% - 20px) / 2); }'
      );
    });

    it('should handle calc() with multiplication', () => {
      const content = '<div class="max-w-[calc(2rem*1.5)] max-w-[calc((2rem*1.5)/2)]">Test</div>';
      const result = extractCustomWidthClasses(content);

      expect(result).toHaveLength(2);
      expect(result[0]).toBe(
        '.max-w-\\[calc\\(2rem\\*1\\.5\\)\\] { max-width: calc(2rem * 1.5); }'
      );
      expect(result[1]).toBe(
        '.max-w-\\[calc\\(\\(2rem\\*1\\.5\\)\\/2\\)\\] { max-width: calc((2rem * 1.5) / 2); }'
      );
    });

    it('should handle calc() with basis', () => {
      const content = '<div class="basis-[calc(100%-20px)] basis-[calc((100%-20px)*2)]">Test</div>';
      const result = extractCustomFlexClasses(content);

      expect(result).toHaveLength(2);
      expect(result[0]).toBe(
        '.basis-\\[calc\\(100\\%\\-20px\\)\\] { flex-basis: calc(100% - 20px); }'
      );
      expect(result[1]).toBe(
        '.basis-\\[calc\\(\\(100\\%\\-20px\\)\\*2\\)\\] { flex-basis: calc((100% - 20px) * 2); }'
      );
    });

    it('should handle calc() with gap', () => {
      const content = '<div class="gap-[calc(1rem+10px)] gap-[calc((1rem+10px)*2)]">Test</div>';
      const result = extractCustomSpacingClasses(content);

      expect(result).toHaveLength(2);
      expect(result[0]).toBe('.gap-\\[calc\\(1rem\\+10px\\)\\] { gap: calc(1rem + 10px); }');
      expect(result[1]).toBe(
        '.gap-\\[calc\\(\\(1rem\\+10px\\)\\*2\\)\\] { gap: calc((1rem + 10px) * 2); }'
      );
    });

    it('should handle calc() with font-size', () => {
      const content = '<div class="font-size-[calc(1rem+10px)]">Test</div>';
      const result = extractCustomFontSizeClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.font-size-\\[calc\\(1rem\\+10px\\)\\] { font-size: calc(1rem + 10px); }'
      );
    });
  });

  describe('min() function', () => {
    it('should handle min() with multiple values', () => {
      const content = '<div class="p-[min(1rem,50px)]">Test</div>';
      const result = extractCustomSpacingClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe('.p-\\[min\\(1rem\\,50px\\)\\] { padding: min(1rem, 50px); }');
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

    it('should handle min() with basis', () => {
      const content = '<div class="basis-[min(100%,20px)]">Test</div>';
      const result = extractCustomFlexClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.basis-\\[min\\(100\\%\\,20px\\)\\] { flex-basis: min(100%, 20px); }'
      );
    });

    it('should handle gap with min()', () => {
      const content = '<div class="gap-[min(1rem,3vw)]">Test</div>';
      const result = extractCustomSpacingClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe('.gap-\\[min\\(1rem\\,3vw\\)\\] { gap: min(1rem, 3vw); }');
    });

    it('should handle font-size with min()', () => {
      const content = '<div class="font-size-[min(1rem,3vw)]">Test</div>';
      const result = extractCustomFontSizeClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe('.font-size-\\[min\\(1rem\\,3vw\\)\\] { font-size: min(1rem, 3vw); }');
    });
  });

  describe('max() function', () => {
    it('should handle max() with two values', () => {
      const content =
        '<div class="m-[max(1rem,20px)] mx-[max(1rem,20px)] my-[max(1rem,20px)]">Test</div>';
      const result = extractCustomSpacingClasses(content);

      expect(result).toHaveLength(3);
      expect(result[0]).toBe('.m-\\[max\\(1rem\\,20px\\)\\] { margin: max(1rem, 20px); }');
      expect(result[1]).toBe(
        '.mx-\\[max\\(1rem\\,20px\\)\\] { margin-left: max(1rem, 20px); margin-right: max(1rem, 20px); }'
      );
      expect(result[2]).toBe(
        '.my-\\[max\\(1rem\\,20px\\)\\] { margin-top: max(1rem, 20px); margin-bottom: max(1rem, 20px); }'
      );
    });

    it('should handle max() with percentage and viewport units', () => {
      const content =
        '<div class="p-[max(0.5rem,1vw)] px-[max(0.5rem,1vw)] py-[max(0.5rem,1vw)]">Test</div>';
      const result = extractCustomSpacingClasses(content);

      expect(result).toHaveLength(3);
      expect(result[0]).toBe('.p-\\[max\\(0\\.5rem\\,1vw\\)\\] { padding: max(0.5rem, 1vw); }');
      expect(result[1]).toBe(
        '.px-\\[max\\(0\\.5rem\\,1vw\\)\\] { padding-left: max(0.5rem, 1vw); padding-right: max(0.5rem, 1vw); }'
      );
      expect(result[2]).toBe(
        '.py-\\[max\\(0\\.5rem\\,1vw\\)\\] { padding-top: max(0.5rem, 1vw); padding-bottom: max(0.5rem, 1vw); }'
      );
    });

    it('should handle max() with two values', () => {
      const content =
        '<div class="min-w-[max(2rem,5vw)] max-w-[max(2rem,5vw)] w-[max(2rem,5vw)]">Test</div>';
      const result = extractCustomWidthClasses(content);

      expect(result).toHaveLength(3);
      expect(result[0]).toBe('.min-w-\\[max\\(2rem\\,5vw\\)\\] { min-width: max(2rem, 5vw); }');
      expect(result[1]).toBe('.max-w-\\[max\\(2rem\\,5vw\\)\\] { max-width: max(2rem, 5vw); }');
      expect(result[2]).toBe('.w-\\[max\\(2rem\\,5vw\\)\\] { width: max(2rem, 5vw); }');
    });

    it('should handle max() with basis', () => {
      const content = '<div class="basis-[max(100%,20px)]">Test</div>';
      const result = extractCustomFlexClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.basis-\\[max\\(100\\%\\,20px\\)\\] { flex-basis: max(100%, 20px); }'
      );
    });

    it('should handle gap-y with max()', () => {
      const content =
        '<div class="gap-y-[max(1rem,2vh)] gap-[max(1rem,2vh)] gap-x-[max(1rem,2vh)]">Test</div>';
      const result = extractCustomSpacingClasses(content);

      expect(result).toHaveLength(3);
      expect(result[0]).toBe('.gap-y-\\[max\\(1rem\\,2vh\\)\\] { row-gap: max(1rem, 2vh); }');
      expect(result[1]).toBe('.gap-\\[max\\(1rem\\,2vh\\)\\] { gap: max(1rem, 2vh); }');
      expect(result[2]).toBe('.gap-x-\\[max\\(1rem\\,2vh\\)\\] { column-gap: max(1rem, 2vh); }');
    });

    it('should handle font-size with max()', () => {
      const content = '<div class="font-size-[max(1rem,3vw)]">Test</div>';
      const result = extractCustomFontSizeClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe('.font-size-\\[max\\(1rem\\,3vw\\)\\] { font-size: max(1rem, 3vw); }');
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
      const content =
        '<div class="p-[clamp(0.5rem,2vw,2rem)] px-[clamp(0.5rem,2vw,2rem)] py-[clamp(0.5rem,2vw,2rem)]">Test</div>';
      const result = extractCustomSpacingClasses(content);

      expect(result).toHaveLength(3);
      expect(result[0]).toBe(
        '.p-\\[clamp\\(0\\.5rem\\,2vw\\,2rem\\)\\] { padding: clamp(0.5rem, 2vw, 2rem); }'
      );
      expect(result[1]).toBe(
        '.px-\\[clamp\\(0\\.5rem\\,2vw\\,2rem\\)\\] { padding-left: clamp(0.5rem, 2vw, 2rem); padding-right: clamp(0.5rem, 2vw, 2rem); }'
      );
      expect(result[2]).toBe(
        '.py-\\[clamp\\(0\\.5rem\\,2vw\\,2rem\\)\\] { padding-top: clamp(0.5rem, 2vw, 2rem); padding-bottom: clamp(0.5rem, 2vw, 2rem); }'
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

    it('should handle gap-x with clamp()', () => {
      const content = '<div class="gap-x-[clamp(0.5rem,2vw,2rem)]">Test</div>';
      const result = extractCustomSpacingClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.gap-x-\\[clamp\\(0\\.5rem\\,2vw\\,2rem\\)\\] { column-gap: clamp(0.5rem, 2vw, 2rem); }'
      );
    });

    it('should handle font-size with clamp()', () => {
      const content = '<div class="font-size-[clamp(1rem,3vw,2rem)]">Test</div>';
      const result = extractCustomFontSizeClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.font-size-\\[clamp\\(1rem\\,3vw\\,2rem\\)\\] { font-size: clamp(1rem, 3vw, 2rem); }'
      );
    });
  });

  describe('rgb() function', () => {
    it('should handle rgb() with three values', () => {
      const content = '<div class="text-[rgb(255,0,0)]">Test</div>';
      const result = extractCustomColorClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe('.text-\\[rgb\\(255\\,0\\,0\\)\\] { color: rgb(255, 0, 0); }');
    });

    it('should handle rgb() with three values', () => {
      const content = '<div class="text-[rgb(255,0,0/1)]">Test</div>';
      const result = extractCustomColorClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe('.text-\\[rgb\\(255\\,0\\,0\\/1\\)\\] { color: rgb(255, 0, 0 / 1); }');
    });

    it('should handle rgba() with four values', () => {
      const content = '<div class="text-[rgba(255,0,0,0.5)]">Test</div>';
      const result = extractCustomColorClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.text-\\[rgba\\(255\\,0\\,0\\,0\\.5\\)\\] { color: rgba(255, 0, 0, 0.5); }'
      );
    });
  });

  describe('hsl() function', () => {
    it('should handle hsl() with three values', () => {
      const content = '<div class="text-[hsl(0,100%,50%)]">Test</div>';
      const result = extractCustomColorClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.text-\\[hsl\\(0\\,100\\%\\,50\\%\\)\\] { color: hsl(0, 100%, 50%); }'
      );
    });

    it('should handle hsl() with four values', () => {
      const content = '<div class="text-[hsl(0,100%,50%/0.5)]">Test</div>';
      const result = extractCustomColorClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.text-\\[hsl\\(0\\,100\\%\\,50\\%\\/0\\.5\\)\\] { color: hsl(0, 100%, 50% / 0.5); }'
      );
    });
  });

  describe('hwb() function', () => {
    it('should handle hwb() with four values', () => {
      const content = '<div class="text-[hwb(0.15turn,25%,0%)]">Test</div>';
      const result = extractCustomColorClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.text-\\[hwb\\(0\\.15turn\\,25\\%\\,0\\%\\)\\] { color: hwb(0.15turn 25% 0%); }'
      );
    });

    it('should handle hwb() with four values', () => {
      const content = '<div class="text-[hwb(0.15turn,25%,0%/0.5)]">Test</div>';
      const result = extractCustomColorClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.text-\\[hwb\\(0\\.15turn\\,25\\%\\,0\\%\\/0\\.5\\)\\] { color: hwb(0.15turn 25% 0% / 0.5); }'
      );
    });
  });

  describe('lab() function', () => {
    it('should handle lab() with four values', () => {
      const content = '<div class="text-[lab(50%,-100%,20)]">Test</div>';
      const result = extractCustomColorClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.text-\\[lab\\(50\\%\\,-100\\%\\,20\\)\\] { color: lab(50% -100% 20); }'
      );
    });

    it('should handle lab() with four values', () => {
      const content = '<div class="text-[lab(50%,20,20/0.5)]">Test</div>';
      const result = extractCustomColorClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.text-\\[lab\\(50\\%\\,20\\,20\\/0\\.5\\)\\] { color: lab(50% 20 20 / 0.5); }'
      );
    });
  });

  describe('oklab() function', () => {
    it('should handle oklab() with four values', () => {
      const content = '<div class="text-[oklab(50%,20,20)]">Test</div>';
      const result = extractCustomColorClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe('.text-\\[oklab\\(50\\%\\,20\\,20\\)\\] { color: oklab(50% 20 20); }');
    });

    it('should handle oklab() with four values', () => {
      const content = '<div class="text-[oklab(50%,20,20/0.5)]">Test</div>';
      const result = extractCustomColorClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.text-\\[oklab\\(50\\%\\,20\\,20\\/0\\.5\\)\\] { color: oklab(50% 20 20 / 0.5); }'
      );
    });
  });

  describe('lch() function', () => {
    it('should handle lch() with four values', () => {
      const content = '<div class="text-[lch(50%,20,20)]">Test</div>';
      const result = extractCustomColorClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe('.text-\\[lch\\(50\\%\\,20\\,20\\)\\] { color: lch(50% 20 20); }');
    });

    it('should handle lch() with four values', () => {
      const content = '<div class="text-[lch(50%,20,20/0.5)]">Test</div>';
      const result = extractCustomColorClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.text-\\[lch\\(50\\%\\,20\\,20\\/0\\.5\\)\\] { color: lch(50% 20 20 / 0.5); }'
      );
    });
  });

  describe('oklch() function', () => {
    it('should handle oklch() with four values', () => {
      const content = '<div class="text-[oklch(40.1%,0.123,21.57)]">Test</div>';
      const result = extractCustomColorClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.text-\\[oklch\\(40\\.1\\%\\,0\\.123\\,21\\.57\\)\\] { color: oklch(40.1% 0.123 21.57); }'
      );
    });

    it('should handle oklch() with four values', () => {
      const content = '<div class="text-[oklch(50%,20,20/0.5)]">Test</div>';
      const result = extractCustomColorClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.text-\\[oklch\\(50\\%\\,20\\,20\\/0\\.5\\)\\] { color: oklch(50% 20 20 / 0.5); }'
      );
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
