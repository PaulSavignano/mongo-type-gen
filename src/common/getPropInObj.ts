import { JSONSchema4 } from 'json-schema';

const getPropInObj = (val: unknown, key: string): unknown | JSONSchema4 => {
  if (typeof val !== 'object' || val === null) {
    return undefined;
  }

  const obj = val as Record<string, unknown>;
  if (key in obj) {
    return obj[key];
  }

  for (const k in obj) {
    const v = obj[k];
    if (Array.isArray(v)) {
      for (const item of v) {
        const result = getPropInObj(item, key);
        if (result !== undefined) {
          return result;
        }
      }
    } else if (typeof obj[k] === 'object') {
      const result = getPropInObj(obj[k], key);
      if (result !== undefined) {
        return result;
      }
    }
  }

  return undefined;
};

export default getPropInObj;