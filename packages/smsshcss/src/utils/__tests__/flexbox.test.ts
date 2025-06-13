import { describe, it, expect } from 'vitest';
import { generateFlexboxClasses } from '../flexbox';

describe('Flexbox Utility Classes', () => {
  describe('generateFlexboxClasses', () => {
    it('should generate all default flexbox classes', () => {
      const result = generateFlexboxClasses();

      // Flex Direction
      expect(result).toContain('.flex-row { flex-direction: row; }');
      expect(result).toContain('.flex-row-reverse { flex-direction: row-reverse; }');
      expect(result).toContain('.flex-col { flex-direction: column; }');
      expect(result).toContain('.flex-col-reverse { flex-direction: column-reverse; }');

      // Flex Wrap
      expect(result).toContain('.flex-wrap { flex-wrap: wrap; }');
      expect(result).toContain('.flex-wrap-reverse { flex-wrap: wrap-reverse; }');
      expect(result).toContain('.flex-nowrap { flex-wrap: nowrap; }');

      // Justify Content
      expect(result).toContain('.justify-start { justify-content: flex-start; }');
      expect(result).toContain('.justify-end { justify-content: flex-end; }');
      expect(result).toContain('.justify-center { justify-content: center; }');
      expect(result).toContain('.justify-between { justify-content: space-between; }');
      expect(result).toContain('.justify-around { justify-content: space-around; }');
      expect(result).toContain('.justify-evenly { justify-content: space-evenly; }');

      // Align Items
      expect(result).toContain('.items-start { align-items: flex-start; }');
      expect(result).toContain('.items-end { align-items: flex-end; }');
      expect(result).toContain('.items-center { align-items: center; }');
      expect(result).toContain('.items-baseline { align-items: baseline; }');
      expect(result).toContain('.items-stretch { align-items: stretch; }');

      // Align Content
      expect(result).toContain('.content-start { align-content: flex-start; }');
      expect(result).toContain('.content-end { align-content: flex-end; }');
      expect(result).toContain('.content-center { align-content: center; }');
      expect(result).toContain('.content-between { align-content: space-between; }');
      expect(result).toContain('.content-around { align-content: space-around; }');
      expect(result).toContain('.content-evenly { align-content: space-evenly; }');

      // Align Self
      expect(result).toContain('.self-auto { align-self: auto; }');
      expect(result).toContain('.self-start { align-self: flex-start; }');
      expect(result).toContain('.self-end { align-self: flex-end; }');
      expect(result).toContain('.self-center { align-self: center; }');
      expect(result).toContain('.self-stretch { align-self: stretch; }');

      // Flex
      expect(result).toContain('.flex-auto { flex: 1 1 auto; }');
      expect(result).toContain('.flex-initial { flex: 0 1 auto; }');
      expect(result).toContain('.flex-none { flex: none; }');

      // Flex Basis
      expect(result).toContain('.basis-none { flex-basis: 0; }');
      expect(result).toContain('.basis-xs { flex-basis: calc(var(--size-base) * 1.5); }');
      expect(result).toContain('.basis-sm { flex-basis: calc(var(--size-base) * 2); }');
      expect(result).toContain('.basis-md { flex-basis: calc(var(--size-base) * 2.5); }');
      expect(result).toContain('.basis-lg { flex-basis: calc(var(--size-base) * 3); }');
      expect(result).toContain('.basis-xl { flex-basis: calc(var(--size-base) * 4); }');
      expect(result).toContain('.basis-2xl { flex-basis: calc(var(--size-base) * 6); }');
      expect(result).toContain('.basis-3xl { flex-basis: calc(var(--size-base) * 8); }');
      expect(result).toContain('.basis-4xl { flex-basis: calc(var(--size-base) * 12); }');
      expect(result).toContain('.basis-5xl { flex-basis: calc(var(--size-base) * 16); }');
      expect(result).toContain('.basis-6xl { flex-basis: calc(var(--size-base) * 20); }');
      expect(result).toContain('.basis-7xl { flex-basis: calc(var(--size-base) * 24); }');
      expect(result).toContain('.basis-8xl { flex-basis: calc(var(--size-base) * 32); }');
      expect(result).toContain('.basis-9xl { flex-basis: calc(var(--size-base) * 48); }');
      expect(result).toContain('.basis-10xl { flex-basis: calc(var(--size-base) * 64); }');
      expect(result).toContain('.basis-11xl { flex-basis: calc(var(--size-base) * 80); }');
      expect(result).toContain('.basis-12xl { flex-basis: calc(var(--size-base) * 96); }');
      expect(result).toContain('.basis-auto { flex-basis: auto; }');
      expect(result).toContain('.basis-full { flex-basis: 100%; }');

      // Flex Grow
      expect(result).toContain('.grow { flex-grow: 1; }');
      expect(result).toContain('.grow-0 { flex-grow: 0; }');

      // Flex Shrink
      expect(result).toContain('.shrink { flex-shrink: 1; }');
      expect(result).toContain('.shrink-0 { flex-shrink: 0; }');
    });
  });

  describe('Integration tests', () => {
    it('should work with typical flex layout patterns', () => {
      const result = generateFlexboxClasses();

      // 典型的なフレックスレイアウトパターンをテスト
      const flexboxPatterns = [
        '.flex-row { flex-direction: row; }',
        '.items-center { align-items: center; }',
        '.justify-between { justify-content: space-between; }',
        '.flex-auto { flex: 1 1 auto; }',
        '.flex-wrap { flex-wrap: wrap; }',
        '.basis-auto { flex-basis: auto; }',
        '.grow { flex-grow: 1; }',
        '.shrink { flex-shrink: 1; }',
      ];

      flexboxPatterns.forEach((pattern) => {
        expect(result).toContain(pattern);
      });
    });

    it('should support complete flexbox system', () => {
      const result = generateFlexboxClasses();

      // すべてのflexboxプロパティが含まれていることを確認
      const properties = [
        'flex-direction',
        'flex-wrap',
        'justify-content',
        'align-items',
        'align-content',
        'align-self',
        'flex',
        'flex-basis',
        'flex-grow',
        'flex-shrink',
      ];

      properties.forEach((property) => {
        expect(result).toContain(property);
      });
    });
  });
});
