const formatDate = (date: string) => {
  const dateVal = new Date(date);
  return dateVal.toLocaleDateString("en-gb", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const dateHelpers = {
  formatDate,
};

export default dateHelpers;
