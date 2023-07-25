interface QueryBuilderProps {
  queryString?: string;
  filter?: {};
  sort?: {};
  perPage?: number;
  page?: number;
  include?: {
    key: string;
    include: boolean;
  }[];
}

const queryBuilder = (query: QueryBuilderProps) => {
  // create new url with query string
  const params = new URLSearchParams(query.queryString || "");

  // Append include query
  if (
    query.include !== undefined &&
    query.include.length > 0 &&
    query.include.some((item) => item.include)
  ) {
    let includeString = params.get("include") || "";
    query.include.forEach((item, index) => {
      if (item.include) {
        includeString += `${item.key},`;
      }
    });
    includeString = includeString.slice(0, -1);
    params.append("include", includeString);
  }

  return params.toString();
};

export default queryBuilder;
