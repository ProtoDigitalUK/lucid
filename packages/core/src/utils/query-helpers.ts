export const generateQueryData = (
  columns: string[],
  values: (any | undefined)[]
) => {
  // Ensure columns and values have the same length
  if (columns.length !== values.length) {
    throw new Error("Columns and values arrays must have the same length");
  }

  // Filter out undefined values and their corresponding columns
  const filteredData = columns
    .map((col, i) => ({ col, val: values[i] }))
    .filter((data) => data.val !== undefined);

  const keys = filteredData.map((data) => data.col);
  const realValues = filteredData.map((data) => data.val);
  const aliases = realValues.map((_, i) => `$${i + 1}`);

  return {
    columns: keys,
    aliases: aliases,
    values: realValues,
  };
};
