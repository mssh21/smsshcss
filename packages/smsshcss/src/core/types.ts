export interface SpacingConfig {
  none?: string;
  '2xs'?: string;
  xs?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  '2xl'?: string;
  '3xl'?: string;
  '4xl'?: string;
  '5xl'?: string;
  [key: string]: string | undefined;
}

export interface WidthConfig {
  none?: string;
  '2xs'?: string;
  xs?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  '2xl'?: string;
  '3xl'?: string;
  '4xl'?: string;
  '5xl'?: string;
  '6xl'?: string;
  '7xl'?: string;
  '8xl'?: string;
  '9xl'?: string;
  '10xl'?: string;
  '11xl'?: string;
  '12xl'?: string;
  full?: string;
  auto?: string;
  fit?: string;
  min?: string;
  max?: string;
  screen?: string;
  content?: string;
  [key: string]: string | undefined;
}

export interface PurgeConfig {
  enabled?: boolean;
  content: string[];
  safelist?: (string | RegExp)[];
  blocklist?: (string | RegExp)[];
  keyframes?: boolean;
  fontFace?: boolean;
  variables?: boolean;
  extractors?: Array<{
    extensions: string[];
    extractor: (content: string) => string[];
  }>;
}

export interface PurgeReport {
  totalClasses: number;
  usedClasses: number;
  purgedClasses: number;
  purgedClassNames: string[];
  safelist: string[];
  buildTime: number;
  fileAnalysis: Array<{
    file: string;
    classesFound: string[];
    size: number;
  }>;
}

export interface SmsshCSSConfig {
  content: string[];
  safelist?: string[];
  includeResetCSS?: boolean;
  includeBaseCSS?: boolean;
  purge?: PurgeConfig;
  theme?: {
    spacing?: SpacingConfig;
    display?: DisplayConfig;
    flexbox?: FlexboxConfig;
  };
}

export interface GeneratedCSS {
  utilities: string;
  components: string;
  base: string;
  reset: string;
}

export type SpacingDirection = 't' | 'r' | 'b' | 'l' | 'x' | 'y' | '';
export type SpacingProperty = 'margin' | 'padding' | 'gap';

export type WidthDirection = 'min' | 'max' | '';
export type WidthProperty = 'width' | 'min-width' | 'max-width';

export type DisplayConfig = {
  [key: string]: string;
};

export type FlexboxConfig = {
  [key: string]: string;
};
