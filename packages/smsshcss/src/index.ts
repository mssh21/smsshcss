/**
 * smsshcss main entry point
 */
import { SmsshCSSConfig } from './core/types';
import { CSSGenerator } from './core/generator';
import { generateDisplayClasses } from './utils/display';
import { generateAllSpacingClasses } from './utils/spacing';
import { getResetCss, getBaseCss } from './utils';
import fg from 'fast-glob';
import fs from 'fs';

// Export types
export type { SmsshCSSConfig };

function extractClassesFromFiles(contentPatterns: string[] = [], debug = false): Set<string> {
  const usedClasses = new Set<string>();
  for (const pattern of contentPatterns) {
    const files = fg.sync(pattern);
    if (debug) console.log('Matched files for pattern', pattern, files);
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        // class="..." や className="..." からクラス名を抽出
        const regex = /class(?:Name)?=["']([^"']+)["']/g;
        let match;
        while ((match = regex.exec(content)) !== null) {
          match[1].split(/\s+/).forEach((cls) => {
            if (cls) usedClasses.add(cls.trim());
          });
        }
      } catch (e) {
        if (debug) console.warn('Failed to read', file, e);
      }
    }
  }
  return usedClasses;
}

// CSSセレクタ用エスケープ関数（Tailwind風）
function escapeClassSelector(className: string): string {
  // CSS特殊文字をバックスラッシュでエスケープ
  // https://developer.mozilla.org/ja/docs/Web/CSS/Identifier#escaping
  return className.replace(/([!"#$%&'()*+,./:;<=>?@[\]^`{|}~])/g, '\\$1');
}

/**
 * Generate CSS based on configuration
 * @param config Configuration options
 * @returns Generated CSS string
 */
export function generateCSS(config: SmsshCSSConfig): string {
  const generator = new CSSGenerator(config);
  return generator.generateFullCSS();
    }

/**
 * Initialize SmsshCSS with default configuration
 * @param config Optional configuration to override defaults
 * @returns Generated CSS string
 */
export function init(config: SmsshCSSConfig = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx,vue,svelte}'],
  includeResetCSS: true,
  includeBaseCSS: true,
}): string {
  return generateCSS(config);
}

// Default export
export default {
  generateCSS,
  init,
};

export * from './core/types';
