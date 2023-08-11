import { createEffect, createSignal } from "solid-js";
import { useLocation, useNavigate } from "@solidjs/router";

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 10;

type FilterValues = string | number | string[] | number[] | boolean | undefined;

interface SearchParamsSchema {
  filters?: {
    [key: string]: {
      value: FilterValues;
      type: "text" | "boolean" | "array";
    };
  };
  sorts?: {
    [key: string]: "asc" | "desc" | undefined;
  };
  pagination?: {
    page?: number;
    per_page?: number;
  };
}

interface SearchParamsConfig {
  singleSort?: boolean;
}

type FilterMap = Map<string, string | number | string[] | number[] | undefined>;
type SortMap = Map<string, "asc" | "desc" | undefined>;

const useSearchParams = (
  schema: SearchParamsSchema,
  options: SearchParamsConfig
) => {
  // -----------------------------------
  // Hooks / State
  const location = useLocation();
  const navigate = useNavigate();

  const [getSettled, setSettled] = createSignal(false);
  const [getSettledTimeout, setSettledTimeout] =
    createSignal<ReturnType<typeof setTimeout>>();

  const [getPrevQueryString, setPrevQueryString] = createSignal("");
  const [getQueryString, setQueryString] = createSignal("");
  const [getFilters, setFilters] = createSignal<FilterMap>(new Map());
  const [getSorts, setSorts] = createSignal<SortMap>(new Map());
  const [getPagination, setPagination] = createSignal({
    page: DEFAULT_PAGE,
    per_page: DEFAULT_PER_PAGE,
  });

  // -----------------------------------
  // Functions
  const filterValueToSting = (
    value?: string | number | string[] | number[] | boolean
  ) => {
    if (value === undefined) return undefined;
    else if (typeof value === "boolean") {
      return value ? "1" : "0";
    } else if (Array.isArray(value)) {
      if (value.length === 0) return undefined;
      return value.join(",");
    } else {
      return value.toString();
    }
  };

  const setLocation = (params: {
    filters?: {
      [key: string]: FilterValues;
    };
    sorts?: SearchParamsSchema["sorts"];
    pagination?: SearchParamsSchema["pagination"];
  }) => {
    const searchParams = new URLSearchParams(location.search);

    // Merge filters into search params
    if (params.filters) {
      for (const [key, value] of Object.entries(params.filters)) {
        const toString = filterValueToSting(value);
        if (toString) {
          searchParams.set(`filter[${key}]`, toString);
        } else {
          searchParams.delete(`filter[${key}]`);
        }
      }
    }

    // Merge sorts into search params
    // sort=test,test2,-test3
    if (params.sorts) {
      const sorts: {
        key: string;
        value: "asc" | "desc";
        raw: string;
      }[] = [];

      if (options.singleSort) {
        // first sort from params.sort
        const key = Object.keys(params.sorts)[0];
        const sort = params.sorts[key];
        if (sort) {
          sorts.push({
            key: key,
            value: sort,
            raw: sort === "asc" ? key : `-${key}`,
          });
        }
      } else {
        const currentSorts = searchParams.get("sort");

        // add current sorts to array
        if (currentSorts) {
          const currentSortArr = currentSorts.split(",");

          currentSortArr.forEach((sort) => {
            const sortKey = sort.startsWith("-") ? sort.slice(1) : sort;
            if (schema.sorts && schema.sorts[sortKey] !== undefined) {
              if (sort.startsWith("-")) {
                sorts.push({
                  key: sort.slice(1),
                  value: "desc",
                  raw: sort,
                });
              } else {
                sorts.push({
                  key: sort,
                  value: "asc",
                  raw: sort,
                });
              }
            }
          });
        }

        for (const [key, value] of Object.entries(params.sorts)) {
          if (value === undefined) {
            const index = sorts.findIndex((sort) => sort.key === key);
            if (index !== -1) {
              sorts.splice(index, 1);
            }
          } else {
            const index = sorts.findIndex((sort) => sort.key === key);
            if (index !== -1) {
              sorts[index].value = value;
              sorts[index].raw = value === "asc" ? key : `-${key}`;
            } else {
              sorts.push({
                key,
                value,
                raw: value === "asc" ? key : `-${key}`,
              });
            }
          }
        }
      }

      // set sorts
      const sortsStr = sorts.map((sort) => sort.raw).join(",");
      if (sortsStr) {
        searchParams.set("sort", sortsStr);
      } else {
        searchParams.delete("sort");
      }
    }

    // Merge pagination into search params
    if (params.pagination) {
      if (params.pagination.page) {
        searchParams.set("page", params.pagination.page.toString());
      } else {
        searchParams.delete("page");
      }
      if (params.pagination.per_page) {
        searchParams.set("per_page", params.pagination.per_page.toString());
      } else {
        searchParams.delete("per_page");
      }
    }

    // Set search params
    navigate(`?${searchParams.toString()}`);
  };
  const setStateFromLocation = (searchParams: URLSearchParams) => {
    // on location change - update filters and sorts based on search params
    const filters = new Map();
    const sorts = new Map();

    // Set filters
    for (const [key, value] of searchParams.entries()) {
      if (key.startsWith("filter[")) {
        const filterKey = key.slice(7, -1); // remove filter[ and ]

        // If schema filter value is boolean, convert to boolean
        if (schema.filters && schema.filters[filterKey].type === "boolean") {
          if (value === "1") filters.set(filterKey, true);
          else if (value === "0") filters.set(filterKey, false);
          else filters.set(filterKey, undefined);
        }
        // if schema filter value type is array, convert to array
        else if (schema.filters && schema.filters[filterKey].type === "array") {
          const asArray = value.split(",");
          // if values are numbers, convert to numbers
          const asNumber = asArray.map((val) => {
            if (!isNaN(Number(val))) return Number(val);
            else return val;
          });
          filters.set(filterKey, asNumber);
        } else {
          const singleValue = isNaN(Number(value)) ? value : Number(value);
          filters.set(filterKey, singleValue);
        }
      }
    }

    // Set sorts
    const sortStr = searchParams.get("sort");
    if (sortStr) {
      for (const [key, value] of Object.entries(schema.sorts || {})) {
        if (sortStr.includes(`-${key}`)) {
          sorts.set(key, value);
        } else if (sortStr.includes(key)) {
          sorts.set(key, value);
        } else {
          sorts.set(key, undefined);
        }
      }
    }

    // Set pagination
    const page = searchParams.get("page");
    const perPage = searchParams.get("per_page");
    if (page) {
      setPagination((prev) => ({ ...prev, page: Number(page) }));
    } else {
      setPagination((prev) => ({ ...prev, page: DEFAULT_PAGE }));
    }
    if (perPage) {
      setPagination((prev) => ({ ...prev, per_page: Number(perPage) }));
    } else {
      setPagination((prev) => ({ ...prev, per_page: DEFAULT_PER_PAGE }));
    }

    setFilters(filters);
    setSorts(sorts);
  };
  const buildQueryString = () => {
    // from filters and sorts, build a query string
    const searchParams = new URLSearchParams();

    // Set filters
    for (const [key, value] of getFilters()) {
      const toString = filterValueToSting(value);
      if (toString !== undefined) {
        searchParams.set(`filter[${key}]`, toString);
      }
    }

    // Set sorts
    const sorts = getSorts();
    let sortsStr = "";
    for (const [key, value] of sorts) {
      if (value === "asc") {
        sortsStr += `${key},`;
      } else if (value === "desc") {
        sortsStr += `-${key},`;
      }
    }

    if (sortsStr) {
      searchParams.set("sort", sortsStr);
    }

    // Set pagination
    const pagination = getPagination();
    if (pagination.page) {
      searchParams.set("page", pagination.page.toString());
    }
    if (pagination.per_page) {
      searchParams.set("per_page", pagination.per_page.toString());
    }

    setPrevQueryString(getQueryString());
    setQueryString(searchParams.toString());
  };

  // Set initial values
  const setDefaultParams = () => {
    const searchParams = new URLSearchParams(location.search);

    let hasFilters = false;
    if (schema.filters) {
      for (const [key] of Object.entries(schema.filters)) {
        if (searchParams.has(`filter[${key}]`)) {
          hasFilters = true;
          break;
        }
      }
    }

    let hasSorts = false;
    if (schema.sorts) {
      if (searchParams.has("sort")) {
        hasSorts = true;
      }
    }

    let hasPagination = false;
    if (schema.pagination) {
      if (searchParams.has("page") || searchParams.has("per_page")) {
        hasPagination = true;
      }
    }

    // if either is false
    if (hasFilters && hasSorts && hasPagination) return;

    // convert schema filters to object of values;
    const filters: {
      [key: string]: FilterValues;
    } = {};
    if (schema.filters) {
      for (const pair of Object.entries(schema.filters)) {
        filters.key = pair[1].value;
      }
    }

    setLocation({
      filters: !hasFilters ? filters : undefined,
      sorts: !hasSorts ? schema.sorts : undefined,
      pagination: !hasPagination ? schema.pagination : undefined,
    });
  };

  // -----------------------------------
  // Effects

  // sync filters, sort by location and build query string
  createEffect(() => {
    setSettled(false);
    setDefaultParams();

    const searchParams = new URLSearchParams(location.search);
    setStateFromLocation(searchParams);

    buildQueryString();
  });

  // handle query string settled
  createEffect(() => {
    const currentQueryString = getQueryString();

    if (currentQueryString !== getPrevQueryString()) {
      if (getSettledTimeout()) {
        clearTimeout(getSettledTimeout());
      }

      const timeout = setTimeout(() => {
        setSettled(true);
      }, 1);

      setSettledTimeout(timeout);
      setPrevQueryString(currentQueryString);
    }
  });

  // -----------------------------------
  // Return
  return {
    getFilters,
    getSorts,
    getSettled,

    // on location change - update filters and sorts based on search params
    // return query string that is built from filters and sorts signals only
    getQueryString,

    // only set the location if the params are different
    // getQueryString handles updating the filters and sorts signals
    setParams: setLocation,
  };
};

export default useSearchParams;
