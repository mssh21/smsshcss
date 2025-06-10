import {
  generateGridClasses,
  generateSubgridClasses,
  generateArbitraryGridCols,
  generateArbitraryGridRows,
  generateArbitraryColumnSpan,
  generateArbitraryRowSpan,
} from '../grid';

describe('Grid Utilities', () => {
  describe('generateGridClasses', () => {
    it('should generate grid-template-columns classes', () => {
      const result = generateGridClasses();

      expect(result).toContain(
        '.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }'
      );
      expect(result).toContain(
        '.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }'
      );
      expect(result).toContain(
        '.grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)); }'
      );
      expect(result).toContain('.grid-cols-none { grid-template-columns: none; }');
      expect(result).toContain('.grid-cols-subgrid { grid-template-columns: subgrid; }');
    });

    it('should generate grid-template-rows classes', () => {
      const result = generateGridClasses();

      expect(result).toContain('.grid-rows-1 { grid-template-rows: repeat(1, minmax(0, 1fr)); }');
      expect(result).toContain('.grid-rows-6 { grid-template-rows: repeat(6, minmax(0, 1fr)); }');
      expect(result).toContain('.grid-rows-12 { grid-template-rows: repeat(12, minmax(0, 1fr)); }');
      expect(result).toContain('.grid-rows-none { grid-template-rows: none; }');
      expect(result).toContain('.grid-rows-subgrid { grid-template-rows: subgrid; }');
    });

    it('should generate grid-column span classes', () => {
      const result = generateGridClasses();

      expect(result).toContain('.col-span-1 { grid-column: span 1 / span 1; }');
      expect(result).toContain('.col-span-6 { grid-column: span 6 / span 6; }');
      expect(result).toContain('.col-span-12 { grid-column: span 12 / span 12; }');
      expect(result).toContain('.col-span-full { grid-column: 1 / -1; }');
    });

    it('should generate grid-row span classes', () => {
      const result = generateGridClasses();

      expect(result).toContain('.row-span-1 { grid-row: span 1 / span 1; }');
      expect(result).toContain('.row-span-6 { grid-row: span 6 / span 6; }');
      expect(result).toContain('.row-span-12 { grid-row: span 12 / span 12; }');
      expect(result).toContain('.row-span-full { grid-row: 1 / -1; }');
    });

    it('should generate grid-column-start classes', () => {
      const result = generateGridClasses();

      expect(result).toContain('.col-start-1 { grid-column-start: 1; }');
      expect(result).toContain('.col-start-6 { grid-column-start: 6; }');
      expect(result).toContain('.col-start-12 { grid-column-start: 12; }');
      expect(result).toContain('.col-start-auto { grid-column-start: auto; }');
    });

    it('should generate grid-column-end classes', () => {
      const result = generateGridClasses();

      expect(result).toContain('.col-end-1 { grid-column-end: 1; }');
      expect(result).toContain('.col-end-6 { grid-column-end: 6; }');
      expect(result).toContain('.col-end-12 { grid-column-end: 12; }');
      expect(result).toContain('.col-end-auto { grid-column-end: auto; }');
    });

    it('should generate grid-row-start classes', () => {
      const result = generateGridClasses();

      expect(result).toContain('.row-start-1 { grid-row-start: 1; }');
      expect(result).toContain('.row-start-7 { grid-row-start: 7; }');
      expect(result).toContain('.row-start-auto { grid-row-start: auto; }');
    });

    it('should generate grid-row-end classes', () => {
      const result = generateGridClasses();

      expect(result).toContain('.row-end-1 { grid-row-end: 1; }');
      expect(result).toContain('.row-end-7 { grid-row-end: 7; }');
      expect(result).toContain('.row-end-auto { grid-row-end: auto; }');
    });

    it('should generate grid-auto-flow classes', () => {
      const result = generateGridClasses();

      expect(result).toContain('.grid-flow-row { grid-auto-flow: row; }');
      expect(result).toContain('.grid-flow-col { grid-auto-flow: column; }');
      expect(result).toContain('.grid-flow-dense { grid-auto-flow: dense; }');
      expect(result).toContain('.grid-flow-row-dense { grid-auto-flow: row dense; }');
      expect(result).toContain('.grid-flow-col-dense { grid-auto-flow: column dense; }');
    });

    it('should include arbitrary value classes templates', () => {
      const result = generateGridClasses();

      expect(result).toContain(
        '.grid-cols-\\[\\$\\{value\\}\\] { grid-template-columns: repeat(var(--value), minmax(0, 1fr)); }'
      );
      expect(result).toContain(
        '.grid-rows-\\[\\$\\{value\\}\\] { grid-template-rows: repeat(var(--value), minmax(0, 1fr)); }'
      );
      expect(result).toContain(
        '.col-span-\\[\\$\\{value\\}\\] { grid-column: span var(--value) / span var(--value); }'
      );
      expect(result).toContain(
        '.row-span-\\[\\$\\{value\\}\\] { grid-row: span var(--value) / span var(--value); }'
      );
      expect(result).toContain(
        '.col-start-\\[\\$\\{value\\}\\] { grid-column-start: var(--value); }'
      );
      expect(result).toContain('.col-end-\\[\\$\\{value\\}\\] { grid-column-end: var(--value); }');
      expect(result).toContain('.row-start-\\[\\$\\{value\\}\\] { grid-row-start: var(--value); }');
      expect(result).toContain('.row-end-\\[\\$\\{value\\}\\] { grid-row-end: var(--value); }');
    });

    it('should accept custom grid config', () => {
      const customConfig = {
        'grid-cols-custom': 'repeat(5, 200px)',
        'custom-span': '2',
      };

      const result = generateGridClasses(customConfig);

      // カスタム設定は含まれるが、propertyMapに対応するもののみCSSとして生成される
      expect(result).toContain(
        '.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }'
      );
    });
  });

  describe('generateSubgridClasses', () => {
    it('should generate subgrid classes', () => {
      const result = generateSubgridClasses();

      expect(result).toContain('.subgrid-cols {');
      expect(result).toContain('display: subgrid;');
      expect(result).toContain('grid-template-columns: subgrid;');

      expect(result).toContain('.subgrid-rows {');
      expect(result).toContain('grid-template-rows: subgrid;');

      expect(result).toContain('.subgrid-both {');
      expect(result).toContain('grid-template-columns: subgrid;');
      expect(result).toContain('grid-template-rows: subgrid;');
    });
  });

  describe('generateArbitraryGridCols', () => {
    it('should generate grid-cols with numeric value', () => {
      const result = generateArbitraryGridCols('80');

      expect(result).toBe(
        '.grid-cols-\\[80\\] { grid-template-columns: repeat(80, minmax(0, 1fr)); }'
      );
    });

    it('should generate grid-cols with CSS value', () => {
      const result = generateArbitraryGridCols('200px,1fr,100px');

      expect(result).toBe(
        '.grid-cols-\\[200px,1fr,100px\\] { grid-template-columns: 200px 1fr 100px; }'
      );
    });
  });

  describe('generateArbitraryGridRows', () => {
    it('should generate grid-rows with numeric value', () => {
      const result = generateArbitraryGridRows('20');

      expect(result).toBe(
        '.grid-rows-\\[20\\] { grid-template-rows: repeat(20, minmax(0, 1fr)); }'
      );
    });

    it('should generate grid-rows with CSS value', () => {
      const result = generateArbitraryGridRows('auto,1fr,auto');

      expect(result).toBe('.grid-rows-\\[auto,1fr,auto\\] { grid-template-rows: auto 1fr auto; }');
    });
  });

  describe('generateArbitraryColumnSpan', () => {
    it('should generate col-span with numeric value', () => {
      const result = generateArbitraryColumnSpan('15');

      expect(result).toBe('.col-span-\\[15\\] { grid-column: span 15 / span 15; }');
    });
  });

  describe('generateArbitraryRowSpan', () => {
    it('should generate row-span with numeric value', () => {
      const result = generateArbitraryRowSpan('8');

      expect(result).toBe('.row-span-\\[8\\] { grid-row: span 8 / span 8; }');
    });
  });
});
