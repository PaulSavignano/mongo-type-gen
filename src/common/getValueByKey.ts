import { JSONSchema4 } from 'json-schema';

const getValueByKey = (data: unknown, key: string): unknown | JSONSchema4 => {
  if (typeof data !== 'object' || data === null) {
    return null;
  }

  if (Array.isArray(data)) {
    for (const item of data) {
      const result = getValueByKey(item, key);
      if (result !== null) {
        return result;
      }
    }
    return null;
  }

  const obj = data as Record<string, unknown>;
  if (key in obj) {
    return obj[key];
  }

  for (const k in obj) {
    const nestedValue = getValueByKey(obj[k], key);
    if (nestedValue !== null) {
      return nestedValue;
    }
  }

  return null;
};

export default getValueByKey;
