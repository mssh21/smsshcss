/**
 * Utility helper functions
 */

/**
 * Create a single utility class
 */
export function createUtilityClass(utility: string): Record<string, string> {
  const [key, value] = utility.split(':').map(s => s.trim());
  return { [key]: value };
}

/**
 * Create multiple utility classes
 */
export function createUtilityClasses(utilities: string[]): Record<string, string> {
  return utilities.reduce((acc, utility) => {
    return { ...acc, ...createUtilityClass(utility) };
  }, {});
}

/**
 * Merge multiple utility classes
 */
export function mergeUtilityClasses(...classes: Record<string, string>[]): Record<string, string> {
  return classes.reduce((acc, curr) => ({ ...acc, ...curr }), {});
} 