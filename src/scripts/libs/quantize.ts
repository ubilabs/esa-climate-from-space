export function quantize(value: number | unknown, step: number) {
  if (typeof value !== "number") {
    console.warn('Value passed to quantize is not a number', value)
    return 0;
  }

  return Math.round(value / step) * step;
}
