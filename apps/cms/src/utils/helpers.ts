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

const helpers = {
  deepMerge,
};

export default helpers;
