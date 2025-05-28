import { extractCustomClasses } from '../spacing';

describe('Enhanced CSS Functions Support', () => {
  describe('calc() function', () => {
    it('should handle calc() with addition', () => {
      const content = '<div class="m-[calc(1rem+10px)]">Test</div>';
      const result = extractCustomClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe('.m-\\[calc\\(1rem\\+10px\\)\\] { margin: calc(1rem + 10px); }');
    });

    it('should handle calc() with subtraction', () => {
      const content = '<div class="p-[calc(100%-20px)]">Test</div>';
      const result = extractCustomClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe('.p-\\[calc\\(100\\%\\-20px\\)\\] { padding: calc(100% - 20px); }');
    });

    it('should handle calc() with multiplication', () => {
      const content = '<div class="mt-[calc(2rem*1.5)]">Test</div>';
      const result = extractCustomClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe('.mt-\\[calc\\(2rem\\*1\\.5\\)\\] { margin-top: calc(2rem * 1.5); }');
    });

    it('should handle calc() with division', () => {
      const content = '<div class="px-[calc(100vh/4)]">Test</div>';
      const result = extractCustomClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.px-\\[calc\\(100vh\\/4\\)\\] { padding-left: calc(100vh / 4); padding-right: calc(100vh / 4); }'
      );
    });
  });

  describe('min() function', () => {
    it('should handle min() with two values', () => {
      const content = '<div class="m-[min(2rem,5vw)]">Test</div>';
      const result = extractCustomClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe('.m-\\[min\\(2rem\\,5vw\\)\\] { margin: min(2rem, 5vw); }');
    });

    it('should handle min() with multiple values', () => {
      const content = '<div class="p-[min(1rem,3%,50px)]">Test</div>';
      const result = extractCustomClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.p-\\[min\\(1rem\\,3\\%\\,50px\\)\\] { padding: min(1rem, 3%, 50px); }'
      );
    });

    it('should handle min() with directional classes', () => {
      const content = '<div class="ml-[min(50px,10vw)]">Test</div>';
      const result = extractCustomClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe('.ml-\\[min\\(50px\\,10vw\\)\\] { margin-left: min(50px, 10vw); }');
    });
  });

  describe('max() function', () => {
    it('should handle max() with two values', () => {
      const content = '<div class="m-[max(1rem,20px)]">Test</div>';
      const result = extractCustomClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe('.m-\\[max\\(1rem\\,20px\\)\\] { margin: max(1rem, 20px); }');
    });

    it('should handle max() with percentage and viewport units', () => {
      const content = '<div class="p-[max(0.5rem,1vw)]">Test</div>';
      const result = extractCustomClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe('.p-\\[max\\(0\\.5rem\\,1vw\\)\\] { padding: max(0.5rem, 1vw); }');
    });

    it('should handle max() with axis directions', () => {
      const content = '<div class="py-[max(1rem,2vh)]">Test</div>';
      const result = extractCustomClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.py-\\[max\\(1rem\\,2vh\\)\\] { padding-top: max(1rem, 2vh); padding-bottom: max(1rem, 2vh); }'
      );
    });
  });

  describe('clamp() function', () => {
    it('should handle clamp() with three values', () => {
      const content = '<div class="m-[clamp(1rem,4vw,3rem)]">Test</div>';
      const result = extractCustomClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.m-\\[clamp\\(1rem\\,4vw\\,3rem\\)\\] { margin: clamp(1rem, 4vw, 3rem); }'
      );
    });

    it('should handle clamp() with complex values', () => {
      const content = '<div class="p-[clamp(0.5rem,2vw,2rem)]">Test</div>';
      const result = extractCustomClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.p-\\[clamp\\(0\\.5rem\\,2vw\\,2rem\\)\\] { padding: clamp(0.5rem, 2vw, 2rem); }'
      );
    });

    it('should handle clamp() with directional classes', () => {
      const content = '<div class="px-[clamp(1rem,5vw,4rem)]">Test</div>';
      const result = extractCustomClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.px-\\[clamp\\(1rem\\,5vw\\,4rem\\)\\] { padding-left: clamp(1rem, 5vw, 4rem); padding-right: clamp(1rem, 5vw, 4rem); }'
      );
    });
  });

  describe('gap with CSS functions', () => {
    it('should handle gap with min()', () => {
      const content = '<div class="gap-[min(1rem,3vw)]">Test</div>';
      const result = extractCustomClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe('.gap-\\[min\\(1rem\\,3vw\\)\\] { gap: min(1rem, 3vw); }');
    });

    it('should handle gap-x with clamp()', () => {
      const content = '<div class="gap-x-[clamp(0.5rem,2vw,2rem)]">Test</div>';
      const result = extractCustomClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.gap-x-\\[clamp\\(0\\.5rem\\,2vw\\,2rem\\)\\] { column-gap: clamp(0.5rem, 2vw, 2rem); }'
      );
    });

    it('should handle gap-y with max()', () => {
      const content = '<div class="gap-y-[max(1rem,2vh)]">Test</div>';
      const result = extractCustomClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe('.gap-y-\\[max\\(1rem\\,2vh\\)\\] { row-gap: max(1rem, 2vh); }');
    });
  });

  describe('nested CSS functions', () => {
    it('should handle calc() with nested min()', () => {
      const content = '<div class="m-[calc(min(2rem,5vw)+10px)]">Test</div>';
      const result = extractCustomClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.m-\\[calc\\(min\\(2rem\\,5vw\\)\\+10px\\)\\] { margin: calc(min(2rem, 5vw) + 10px); }'
      );
    });

    it('should handle max() with nested calc() and clamp()', () => {
      const content = '<div class="p-[max(calc(1rem*2),clamp(1rem,3vw,2rem))]">Test</div>';
      const result = extractCustomClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.p-\\[max\\(calc\\(1rem\\*2\\)\\,clamp\\(1rem\\,3vw\\,2rem\\)\\)\\] { padding: max(calc(1rem * 2), clamp(1rem, 3vw, 2rem)); }'
      );
    });

    it('should handle clamp() with nested calc() functions', () => {
      const content = '<div class="mt-[clamp(calc(1rem+5px),4vw,calc(3rem-10px))]">Test</div>';
      const result = extractCustomClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.mt-\\[clamp\\(calc\\(1rem\\+5px\\)\\,4vw\\,calc\\(3rem\\-10px\\)\\)\\] { margin-top: clamp(calc(1rem + 5px), 4vw, calc(3rem - 10px)); }'
      );
    });
  });

  describe('multiple CSS functions in one content', () => {
    it('should handle multiple different CSS functions', () => {
      const content = `
        <div class="m-[calc(1rem+10px)] p-[min(2rem,5vw)]">
          <span class="gap-[max(1rem,20px)] mt-[clamp(0.5rem,2vw,2rem)]">Test</span>
        </div>
      `;
      const result = extractCustomClasses(content);

      expect(result).toHaveLength(4);
      expect(result).toContain('.m-\\[calc\\(1rem\\+10px\\)\\] { margin: calc(1rem + 10px); }');
      expect(result).toContain('.p-\\[min\\(2rem\\,5vw\\)\\] { padding: min(2rem, 5vw); }');
      expect(result).toContain('.gap-\\[max\\(1rem\\,20px\\)\\] { gap: max(1rem, 20px); }');
      expect(result).toContain(
        '.mt-\\[clamp\\(0\\.5rem\\,2vw\\,2rem\\)\\] { margin-top: clamp(0.5rem, 2vw, 2rem); }'
      );
    });
  });

  describe('CSS variables with functions', () => {
    it('should handle CSS variables correctly', () => {
      const content = '<div class="m-[var(--spacing-dynamic)]">Test</div>';
      const result = extractCustomClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.m-\\[var\\(--spacing-dynamic\\)\\] { margin: var(--spacing-dynamic); }'
      );
    });

    it('should not apply CSS function formatting to CSS variables', () => {
      const content = '<div class="p-[var(--responsive-padding)]">Test</div>';
      const result = extractCustomClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.p-\\[var\\(--responsive-padding\\)\\] { padding: var(--responsive-padding); }'
      );
    });
  });

  describe('edge cases', () => {
    it('should handle functions with no spaces', () => {
      const content = '<div class="m-[min(1rem,2rem)]">Test</div>';
      const result = extractCustomClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe('.m-\\[min\\(1rem\\,2rem\\)\\] { margin: min(1rem, 2rem); }');
    });

    it('should handle functions with extra spaces', () => {
      const content = '<div class="m-[min( 1rem , 2rem )]">Test</div>';
      const result = extractCustomClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe('.m-\\[min\\( 1rem \\, 2rem \\)\\] { margin: min(1rem, 2rem); }');
    });

    it('should handle mixed units and values', () => {
      const content = '<div class="p-[clamp(10px,2vw,3rem)]">Test</div>';
      const result = extractCustomClasses(content);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(
        '.p-\\[clamp\\(10px\\,2vw\\,3rem\\)\\] { padding: clamp(10px, 2vw, 3rem); }'
      );
    });
  });
});
