/**
 * Colors Token
 */

import { backgroundColor } from "../utils/color";

export const colors = {
  primary: 'hsl(248, 75%, 45%, 100%)',
  secondary: 'hsl(216, 20%, 45%, 100%)',
  accent: 'hsl(35, 95%, 45%, 100%)',
  success: 'hsl(160, 75%, 45%, 100%)',
  warning: 'hsl(55, 75%, 45%, 100%)',
  error: 'hsl(5, 75%, 45%, 100%)',
  info: 'hsl(216, 75%, 45%, 100%)',
  black: 'hsl(0, 0%, 0%, 100%)',
  gray: 'hsl(0, 0%, 15%, 100%)',
  muted: 'hsl(0, 0%, 25%, 100%)',
  inverse: 'hsl(0, 0%, 100%, 100%)',
  white: 'hsl(0, 0%, 100%, 100%)',

  // Text Colors
  textPrimary: 'hsl(0, 0%, 5%, 100%)',
  textSecondary: 'hsl(0, 0%, 15%, 100%)',
  textTertiary: 'hsl(0, 0%, 25%, 100%)',
  textDisabled: 'hsl(0, 0%, 85%, 100%)',
  textLink: 'hsl(216, 75%, 45%, 100%)',
  textLinkHover: 'hsl(216, 75%, 55%, 100%)',
  textLinkPressed: 'hsl(216, 75%, 65%, 100%)',
  textLinkVisited: 'hsl(271, 91%, 45%, 100%)',
  textLinkFocus: 'hsl(216, 75%, 55%, 100%)',
  textWarning: 'hsl(55, 75%, 25%, 100%)',
  textError: 'hsl(5, 75%, 25%, 100%)',
  textInfo: 'hsl(216, 75%, 25%, 100%)',
  textSuccess: 'hsl(160, 75%, 25%, 100%)',
  textPlaceholder: 'hsl(0, 0%, 35%, 100%)',

  // Border Colors
  borderDefault: 'hsl(0, 0%, 75%, 100%)',
  borderDisabled: 'hsl(0, 0%, 85%, 100%)',
  borderSuccess: 'hsl(160, 75%, 25%, 100%)',
  borderWarning: 'hsl(55, 75%, 25%, 100%)',
  borderError: 'hsl(5, 75%, 25%, 100%)',
  borderInfo: 'hsl(216, 75%, 25%, 100%)',
  borderTransparent: 'hsl(0, 0%, 0%, 0%)',
  
  
  // Background Colors
  backgroundBase: 'hsl(0, 0%, 100%, 100%)',
  backgroundSurface: 'hsl(0, 0%, 95%, 100%)',
  backgroundElevation: 'hsl(0, 0%, 95%, 100%)',
  backgroundSuccess: 'hsl(160, 75%, 95%, 100%)',
  backgroundWarning: 'hsl(55, 75%, 95%, 100%)',
  backgroundError: 'hsl(5, 75%, 95%, 100%)',
  backgroundInfo: 'hsl(216, 75%, 95%, 100%)',
  backgroundTransparent: 'hsl(0, 0%, 0%, 0%)',
} as const;