export function getCssVarPx(varName: string): number {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();

  if (value.endsWith("rem")) {
    const rem = parseFloat(value);
    return (
      rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
    );
  }

  if (value.endsWith("px")) {
    return parseFloat(value);
  }

  return parseFloat(value); // fallback, e.g. for colors or strings
}
