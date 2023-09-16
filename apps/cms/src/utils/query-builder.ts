export interface QueryBuilderProps {
  queryString?: string;
  filters?: Record<
    string,
    string | number | string[] | number[] | undefined | null
  >;
  sort?: Record<string, string>;
  perPage?: number;
  page?: number;
  include?: Record<string, boolean>;
}

const queryBuilder = (query: QueryBuilderProps) => {
  // create new url with query string
  const params = new URLSearchParams(query.queryString || "");

  // Append include query
  if (query.include !== undefined && Object.keys(query.include).length > 0) {
    let includeString = params.get("include") || "";
    Object.keys(query.include).forEach((key) => {
      if (query.include && query.include[key]) {
        includeString += `${key},`;
      }
    });
    includeString = includeString.slice(0, -1);
    if (includeString.length > 0) params.append("include", includeString);
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
    params.append("per_page", query.perPage.toString());
  }

  return params.toString();
};

export default queryBuilder;
