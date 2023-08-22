import { Accessor } from "solid-js";
import equal from "fast-deep-equal";

// ---------------------------------------------
//
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GenericObject = Record<string, any>;

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
        if (!equal(obj1[key], obj2[key])) {
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
const updateData = <T>(obj1: T, obj2: T) => {
  const result = deepDiff(obj1, obj2);
  return {
    changed: Object.keys(result).length > 0,
    data: result,
  };
};

// ---------------------------------------------
// Resolve signals and return the value
const resolveValue = <T>(value: Accessor<T> | T): T =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  typeof value === "function" ? (value as any)() : value;

const helpers = {
  deepMerge,
  deepDiff,
  updateData,
  resolveValue,
};

export default helpers;
