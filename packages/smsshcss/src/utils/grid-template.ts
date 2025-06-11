// Grid Template Columns と Rows のカスタムテーマサポート

export function generateGridTemplateClasses(
  gridTemplateColumnsConfig?: Record<string, string>,
  gridTemplateRowsConfig?: Record<string, string>
): string {
  const classes: string[] = [];

  // Grid Template Columns のカスタムクラスを生成
  if (gridTemplateColumnsConfig) {
    Object.entries(gridTemplateColumnsConfig).forEach(([key, value]) => {
      classes.push(`.grid-cols-${key} { grid-template-columns: ${value}; }`);
    });
  }

  // Grid Template Rows のカスタムクラスを生成
  if (gridTemplateRowsConfig) {
    Object.entries(gridTemplateRowsConfig).forEach(([key, value]) => {
      classes.push(`.grid-rows-${key} { grid-template-rows: ${value}; }`);
    });
  }

  return classes.join('\n');
}
