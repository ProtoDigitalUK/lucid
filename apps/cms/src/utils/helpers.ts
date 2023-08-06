type GenericObject = { [key: string]: any };

const deepMerge = (obj1: GenericObject, obj2: GenericObject): GenericObject => {
  const result: GenericObject = { ...obj1 };

  for (const key in obj2) {
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
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

// ---------------------------------------------
// Returns any updated values in obj2 compared to obj1
const deepDiff = <T>(obj1: T, obj2: T): Partial<T> => {
  const result: Partial<T> = {};

  for (const key in obj1) {
    if (Object.prototype.hasOwnProperty.call(obj1, key)) {
      if (Array.isArray(obj1[key])) {
        if (!compareArrays(obj1[key] as any, obj2[key] as any)) {
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

  // go through obj2 and find keys that are not in obj1
  for (const key in obj2) {
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      if (!obj1[key]) {
        result[key] = obj2[key];
      }
    }
  }

  return result;
};

const compareArrays = (arr1: any[], arr2: any[]): boolean => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (!arr2.includes(arr1[i])) {
      return false;
    }
  }

  return true;
};

const helpers = {
  deepMerge,
  deepDiff,
};

export default helpers;
