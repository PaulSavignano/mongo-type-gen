function singularize(name: string): string {
  // Define common plural-to-singular conversion rules
  const pluralToSingular: { [plural: string]: string } = {
    es: '',
    ies: 'y',
    oes: 'o',
    s: '',
    ves: 'f',
    xes: 'x',
  };

  // Check if the plural name matches any of the conversion rules
  for (const pluralSuffix in pluralToSingular) {
    if (name.endsWith(pluralSuffix)) {
      return name.slice(0, -pluralSuffix.length) + pluralToSingular[pluralSuffix];
    }
  }

  // If no match found in the rules, return the original name
  return name;
}

export default singularize;
