const handleError = (e: unknown): unknown => {
  if (e instanceof Error) {
    const eAsObj = e as unknown as Record<string, string>;
    const obj = Object.getOwnPropertyNames(e).reduce<Record<string, string>>((a, v) => {
      a[v] = eAsObj[v];
      return a;
    }, {});
    return obj;
  }
  return e;
};

export default handleError;
