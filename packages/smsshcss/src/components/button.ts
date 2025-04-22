/**
 * Card
  */

import { UtilityCategory } from '../types';
import { colors } from '../tokens';

export const button: UtilityCategory = {
  'btn': `
    display: inline-flex;
    background-color: ${colors.indigo500};
    padding: 12px 16px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    line-height: 100%;
  `,
  'btn.btn-small': `
    padding: 8px 12px;
    font-size: 14px;
  `,
  'btn.btn-medium': `
    padding: 12px 16px;
  `,
  'btn.btn-large': `
    padding: 16px 20px;
    font-size: 20px;
    gap: 12px;
  `,
  'btn.btn-filled': `
    background-color: ${colors.indigo500};
    color: ${colors.white};
  `,
  'btn.btn-outlined': `
    background-color: ${colors.gray000};
    color: ${colors.indigo500};
    border: 1px solid ${colors.indigo500};
  `,
  'btn.btn-ghost': `
    background-color: transparent;
    color: ${colors.indigo500};
  `,
};

