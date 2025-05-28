import { SmsshCSSConfig, GeneratedCSS } from './types';
import { generateAllSpacingClasses } from '../utils/spacing';
import fs from 'fs';
import path from 'path';

export class CSSGenerator {
  private config: SmsshCSSConfig;
  private resetCSS: string;
  private baseCSS: string;

  constructor(config: SmsshCSSConfig) {
    this.config = config;
    this.resetCSS = this.loadResetCSS();
    this.baseCSS = this.loadBaseCSS();
  }

  private loadResetCSS(): string {
    return fs.readFileSync(
      path.join(__dirname, '../styles/reset.css'),
      'utf-8'
    );
  }

  private loadBaseCSS(): string {
    return fs.readFileSync(
      path.join(__dirname, '../styles/base.css'),
      'utf-8'
    );
  }

  public generate(): GeneratedCSS {
    const spacingConfig = this.config.theme?.spacing;
    const utilities = generateAllSpacingClasses(spacingConfig);

    return {
      utilities,
      components: '', // 必要に応じて実装
      base: this.config.includeBaseCSS ? this.baseCSS : '',
      reset: this.config.includeResetCSS ? this.resetCSS : '',
    };
  }

  public generateFullCSS(): string {
    const { utilities, components, base, reset } = this.generate();
    return [reset, base, utilities, components]
      .filter(Boolean)
      .join('\n\n');
  }
} 