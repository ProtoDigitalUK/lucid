type GenericObject = { [key: string]: any };

const deepMerge = (obj1: GenericObject, obj2: GenericObject): GenericObject => {
  const result: GenericObject = { ...obj1 };

  for (const key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (
        typeof obj2[key] === "object" &&
        obj2[key] !== null &&
        !Array.isArray(obj2[key]) &&
        obj1[key]
      ) {
        result[key] = deepMerge(obj1[key], obj2[key]);
      } else {
        result[key] = obj2[key];
      }
    }
  }

  return result;
};

const deepDiff = <T>(obj1: T, obj2: T): Partial<T> => {
  const result: Partial<T> = {};

  for (const key in obj1) {
    // @ts-ignore
    if (obj1.hasOwnProperty(key)) {
      if (Array.isArray(obj1[key])) {
        if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
          result[key] = obj2[key];
        }
      } else if (typeof obj1[key] === "object") {
        const diff = deepDiff(obj1[key], obj2[key]);
        if (Object.keys(diff).length > 0) {
          // @ts-ignore
          result[key] = diff;
        }
      } else {
        if (obj1[key] !== obj2[key]) {
          result[key] = obj2[key];
        }
      }
    }
  }

  return result;
};

const helpers = {
  deepMerge,
  deepDiff,
};

export default helpers;
