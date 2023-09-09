// Limited 1 level deep and file/string only object to form data conversion
// TODO: update down line if req

const objectToFormData = <T = Record<string, string | File>>(
  obj: T
): FormData => {
  const formData = new FormData();

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (value instanceof File) {
        formData.append(key, value);
        continue;
      }
      if (typeof value === "string") {
        formData.append(key, value);
        continue;
      }
    }
  }

  return formData;
};

export default objectToFormData;
