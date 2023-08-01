const formatJsonString = (obj: unknown): string => {
  if (!obj) return '';
  const keys = Object.keys(obj);
  if (!keys || !keys.length) return '{}';
  const json = JSON.stringify(obj, null, 2);
  const removeDoubleQuoteKeys = json.replace(/"([^"]+)":/g, '$1:');
  const replaceDoubleQuotes = removeDoubleQuoteKeys.replace(/"([^"]*)"/g, (p, p1) => {
    if (p1.includes("'")) {
      return `"${p1}"`; // Use single quotes if value contains single quotes
    }
    return `'${p1}'`; // Use double quotes otherwise
  });
  // const addOpeningBraketSpacing = replaceDoubleQuotes.replace(/[[]/g, '[ ');
  // const addClosingBraketSpacing = addOpeningBraketSpacing.replace(/]/g, ' ]');
  // const addOpeningBraceSpacing = addClosingBraketSpacing.replace(/{/g, '{ ');
  // const addClosingBraceSpacing = addOpeningBraceSpacing.replace(/}/g, ' }');
  // const addComaSpacing = addClosingBraceSpacing.replace(/,/g, ', ');
  return replaceDoubleQuotes;
};

export default formatJsonString;
