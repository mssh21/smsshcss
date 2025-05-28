import { generateDisplayClasses } from '../display';

describe('Display Utilities', () => {
  describe('generateDisplayClasses', () => {
    it('should generate basic display classes', () => {
      const result = generateDisplayClasses();
      
      // 基本的なレイアウトクラス
      expect(result).toContain('.block { display: block; }');
      expect(result).toContain('.inline { display: inline; }');
      expect(result).toContain('.inline-block { display: inline flow-root; }');
      expect(result).toContain('.flex { display: block flex; }');
      expect(result).toContain('.inline-flex { display: inline flex; }');
      expect(result).toContain('.grid { display: block grid; }');
      expect(result).toContain('.inline-grid { display: inline grid; }');
      expect(result).toContain('.none { display: none; }');
      expect(result).toContain('.contents { display: contents; }');
      expect(result).toContain('.hidden { display: none; }');
    });

    it('should generate additional layout classes', () => {
      const result = generateDisplayClasses();
      
      // 追加のレイアウトクラス
      expect(result).toContain('.flow-root { display: block flow-root; }');
      expect(result).toContain('.list-item { display: block flow list-item; }');
      expect(result).toContain('.inline-table { display: inline table; }');
      expect(result).toContain('.table { display: block table; }');
      expect(result).toContain('.table-cell { display: table-cell; }');
      expect(result).toContain('.table-row { display: table-row; }');
      expect(result).toContain('.table-caption { display: table-caption; }');
    });

    it('should generate custom display classes when config is provided', () => {
      const customConfig = {
        custom: 'block',
        'custom-inline': 'inline',
      };
      
      const result = generateDisplayClasses(customConfig);
      
      expect(result).toContain('.custom { display: block; }');
      expect(result).toContain('.custom-inline { display: inline; }');
    });

    it('should not include default classes when custom config is provided', () => {
      const customConfig = {
        custom: 'block',
      };
      
      const result = generateDisplayClasses(customConfig);
      
      expect(result).not.toContain('.block { display: block; }');
      expect(result).not.toContain('.inline { display: inline; }');
    });
  });
}); 