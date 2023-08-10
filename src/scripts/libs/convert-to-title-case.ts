export const convertToTitleCase = (inputString: string) =>
  inputString
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace(/Story/g, '');
