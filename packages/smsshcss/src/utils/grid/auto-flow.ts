import { GridConfig } from '../../core/types';

// デフォルトのGrid Auto Flow設定
export const defaultAutoFlow: Partial<GridConfig> = {
  'grid-flow-row': 'row',
  'grid-flow-col': 'column',
  'grid-flow-dense': 'dense',
  'grid-flow-row-dense': 'row dense',
  'grid-flow-col-dense': 'column dense',
};

// プロパティマッピング
export const autoFlowPropertyMap: Record<string, string> = {
  'grid-flow-row': 'grid-auto-flow',
  'grid-flow-col': 'grid-auto-flow',
  'grid-flow-dense': 'grid-auto-flow',
  'grid-flow-row-dense': 'grid-auto-flow',
  'grid-flow-col-dense': 'grid-auto-flow',
};
