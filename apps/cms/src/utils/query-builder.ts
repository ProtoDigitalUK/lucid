export interface QueryBuilderProps {
  queryString?: string;
  filters?: {
    [key: string]: string | number | string[] | number[] | undefined | null;
  };
  sort?: Record<string, string>;
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
    query.include.forEach((item) => {
      if (item.include) {
        includeString += `${item.key},`;
      }
    });
    includeString = includeString.slice(0, -1);
    params.append("include", includeString);
  }

  // Append filters query
  if (query.filters !== undefined && Object.keys(query.filters).length > 0) {
    Object.keys(query.filters).forEach((key) => {
      const value = query.filters ? query.filters[key] : "";
      if (value === undefined || value === null) return;

      if (Array.isArray(value)) {
        params.append(`filter[${key}]`, value.join(","));
      }

      if (typeof value === "string" || typeof value === "number") {
        params.append(`filter[${key}]`, value.toString());
      }
    });
  }

  // Append perPage query
  if (query.perPage !== undefined) {
    params.append("perPage", query.perPage.toString());
  }

  return params.toString();
};

export default queryBuilder;
