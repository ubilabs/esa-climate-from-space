/**
 * Debounces a function by the specified delay.
 * If the function is called again before the delay has passed, the previous timeout is cleared and a new one is set.
 */
export const debounce = (func: () => void, delay: number, debounceTimeout: { current: NodeJS.Timeout | null }) => {

  if (debounceTimeout.current) {
    clearTimeout(debounceTimeout.current);
  }
  debounceTimeout.current = setTimeout(func, delay);
};
