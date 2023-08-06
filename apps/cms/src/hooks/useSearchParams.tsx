import { createMemo } from "solid-js";
import { useLocation, useNavigate } from "@solidjs/router";

interface SearchParamsSchema {
  filters?: {
    [key: string]: string | number | string[] | number[] | undefined;
  };
  sorts?: {
    [key: string]: "asc" | "desc" | undefined;
  };
  pagination?: {
    page?: number;
    perPage?: number;
  };
}

const useSearchParams = (schema: SearchParamsSchema) => {
  // -----------------------------------
  // Hooks / State
  const location = useLocation();
  const navigate = useNavigate();

  // -----------------------------------
  // Util Functions
  const sortOperation = (sort: "asc" | "desc") => {
    return sort === "asc" ? "" : "-";
  };

  // -----------------------------------
  // Functions
  const navigateTo = (params: {
    filters?: ReturnType<typeof mergeFilters>;
    sorts?: ReturnType<typeof mergeSorts>;
  }) => {
    const search = mergeParams(params);
    navigate(`${location.pathname}?${search}`);
  };

  const mergeParams = (params: {
    filters?: ReturnType<typeof mergeFilters>;
    sorts?: ReturnType<typeof mergeSorts>;
  }) => {
    const searchParams = new URLSearchParams();

    // Add filters
    params.filters?.forEach((value, key) => {
      if (value) {
        searchParams.set(`filter[${key}]`, value);
      }
    });

    // Add sorts
    const sorts: string[] = [];
    params.sorts?.forEach((value, key) => {
      if (value) {
        sorts.push(`${sortOperation(value)}${key}`);
      }
    });
    if (sorts.length > 0) {
      searchParams.set("sort", sorts.join(","));
    }

    return searchParams.toString();
  };
  const mergeFilters = (filters: SearchParamsSchema["filters"]) => {
    const searchParams = new URLSearchParams(location.search);
    const filterMap = new Map<string, string | undefined>();

    if (schema.filters === undefined) filterMap;

    for (const key in schema.filters) {
      // Set filters from search if they are valid
      const spValue = searchParams.get(`filter[${key}]`);
      filterMap.set(key, spValue || undefined);

      // Merge filters from param
      if (filters) {
        const value = filters[key];
        if (value === undefined) {
          filterMap.set(key, value);
        } else if (Array.isArray(value)) {
          if (value.length > 0) {
            filterMap.set(key, value.join(","));
          } else {
            filterMap.set(key, undefined);
          }
        } else {
          filterMap.set(key, value.toString());
        }
      }
    }

    return filterMap;
  };
  const mergeSorts = (sorts: SearchParamsSchema["sorts"]) => {
    const searchParams = new URLSearchParams(location.search);
    const sortsValues = new Map<string, "asc" | "desc" | undefined>();

    if (schema.sorts === undefined) return sortsValues;

    const searchSorts = searchParams.get("sort");
    for (const key in schema.sorts) {
      // Set sort base from schema
      const value = schema.sorts[key];
      sortsValues.set(key, value);

      // Add from search if it exists
      if (searchSorts?.includes(key)) {
        sortsValues.set(key, "asc");
      } else if (searchSorts?.includes(`-${key}`)) {
        sortsValues.set(key, "desc");
      } else {
        sortsValues.set(key, undefined);
      }

      // Add from param
      if (sorts && sorts[key]) {
        const value = sorts[key];
        sortsValues.set(key, value);
      }
    }

    return sortsValues;
  };

  // -----------------------------------
  // Memos
  const getQueryString = createMemo(() => {
    const searchParams = new URLSearchParams(location.search);

    // Set defauly schema values if they don't exist in the search already

    // Filters
    for (const key in schema.filters) {
      const valExists = searchParams.get(`filter[${key}]`);
      if (!valExists) {
        const addValue = schema.filters[key];
        if (addValue !== undefined && addValue !== "") {
          if (Array.isArray(addValue)) {
            if (addValue.length > 0) {
              searchParams.set(`filter[${key}]`, addValue.join(","));
            }
          } else {
            searchParams.set(`filter[${key}]`, addValue.toString());
          }
        }
      }
    }

    // Sorts
    const searchSorts = searchParams.get("sort");
    for (const key in schema.sorts) {
      if (!searchSorts?.includes(key) && !searchSorts?.includes(`-${key}`)) {
        const addValue = schema.sorts[key];
        if (addValue !== undefined) {
          searchParams.append("sort", `${sortOperation(addValue)}${key}`);
        }
      }
    }

    return searchParams.toString();
  });

  const getFilters = createMemo(() => {
    const searchParams = new URLSearchParams(getQueryString());

    let filters: SearchParamsSchema["filters"] = {};
    for (const key in schema.filters) {
      const value = searchParams.get(`filter[${key}]`);
      if (value) {
        filters[key] = value;
      }
    }

    return filters;
  });

  const getSorts = createMemo(() => {
    const searchParams = new URLSearchParams(getQueryString());

    let sorts: SearchParamsSchema["sorts"] = {};
    const searchSorts = searchParams.get("sort");
    for (const key in schema.sorts) {
      if (searchSorts?.includes(key)) {
        sorts[key] = "asc";
      } else if (searchSorts?.includes(`-${key}`)) {
        sorts[key] = "desc";
      } else {
        sorts[key] = undefined;
      }
    }

    return sorts;
  });

  // -----------------------------------
  // Return
  return {
    // Getters
    getQueryString,

    getFilters,
    getSorts,

    // Setters
    setParams: (params: {
      filters?: SearchParamsSchema["filters"];
      sorts?: SearchParamsSchema["sorts"];
    }) => {
      const filterMap = mergeFilters(params.filters || {});
      const sortMap = mergeSorts(params.sorts || {});
      navigateTo({
        filters: filterMap,
        sorts: sortMap,
      });
    },
  };
};

export default useSearchParams;
