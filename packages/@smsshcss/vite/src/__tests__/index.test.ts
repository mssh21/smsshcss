import { describe, it, expect } from 'vitest';
import smsshcss from '../index';

describe('smsshcss', () => {
  it('should transform CSS files', () => {
    const plugin = smsshcss();
    const result = plugin.transform('body { color: red; }', 'test.css');
    expect(result).toBeDefined();
    expect(result?.code).toContain('body { color: red; }');
  });

  it('should not transform non-CSS files', () => {
    const plugin = smsshcss();
    const result = plugin.transform('console.log("test")', 'test.js');
    expect(result).toBeNull();
  });

  it('should include reset CSS when includeReset is true', () => {
    const plugin = smsshcss({ includeReset: true });
    const result = plugin.transform('body { color: red; }', 'test.css');
    expect(result?.code).toContain('/* Reset CSS */');
  });

  it('should not include reset CSS when includeReset is false', () => {
    const plugin = smsshcss({ includeReset: false });
    const result = plugin.transform('body { color: red; }', 'test.css');
    expect(result?.code).not.toContain('/* Reset CSS */');
  });

  it('should include base CSS when includeBase is true', () => {
    const plugin = smsshcss({ includeBase: true });
    const result = plugin.transform('body { color: red; }', 'test.css');
    expect(result?.code).toContain('/* Base CSS */');
  });

  it('should not include base CSS when includeBase is false', () => {
    const plugin = smsshcss({ includeBase: false });
    const result = plugin.transform('body { color: red; }', 'test.css');
    expect(result?.code).not.toContain('/* Base CSS */');
  });

  it('should include spacing and display utilities', () => {
    const plugin = smsshcss();
    const result = plugin.transform('', 'file.css');
    
    expect(result?.code).toContain('.m-md { margin: 1rem; }');
    expect(result?.code).toContain('.p-md { padding: 1rem; }');
    expect(result?.code).toContain('.flex { display: block flex; }');
    expect(result?.code).toContain('.grid { display: block grid; }');
  });

  it('should respect includeReset option', () => {
    const plugin = smsshcss({ includeReset: false });
    const result = plugin.transform('', 'file.css');
    
    expect(result?.code).not.toContain('/* Reset CSS */');
  });

  it('should respect includeBase option', () => {
    const plugin = smsshcss({ includeBase: false });
    const result = plugin.transform('', 'file.css');
    
    expect(result?.code).not.toContain('/* Base CSS */');
  });

  it('should apply custom theme options', () => {
    const plugin = smsshcss({
      theme: {
        spacing: {
          custom: '2rem',
        },
        display: {
          custom: 'block',
        },
      },
    });
    const result = plugin.transform('', 'file.css');
    
    expect(result?.code).toContain('.m-custom { margin: 2rem; }');
    expect(result?.code).toContain('.p-custom { padding: 2rem; }');
    expect(result?.code).toContain('.custom { display: block; }');
  });

  it('should preserve original CSS content', () => {
    const originalCSS = 'body { color: red; }';
    const plugin = smsshcss();
    const result = plugin.transform(originalCSS, 'file.css');
    
    expect(result?.code).toContain(originalCSS);
  });

  it('should handle empty CSS content', () => {
    const plugin = smsshcss();
    const result = plugin.transform('', 'file.css');
    
    expect(result).toBeDefined();
    expect(result?.code).toBeDefined();
    expect(result?.code).not.toBe('');
  });
}); 