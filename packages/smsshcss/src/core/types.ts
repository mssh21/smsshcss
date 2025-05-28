export interface SpacingConfig {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface SmsshCSSConfig {
  content: string[];
  safelist?: string[];
  includeResetCSS?: boolean;
  includeBaseCSS?: boolean;
  theme?: {
    spacing?: SpacingConfig;
  };
}

export interface GeneratedCSS {
  utilities: string;
  components: string;
  base: string;
  reset: string;
}

export type SpacingDirection = 't' | 'r' | 'b' | 'l' | 'x' | 'y' | '';
export type SpacingProperty = 'margin' | 'padding';

export type DisplayConfig = {
  [key: string]: string;
}; 