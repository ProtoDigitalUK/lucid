import { createMemo, createSignal } from "solid-js";
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

type FilterMap = Map<string, string | number | string[] | number[] | undefined>;
type SortMap = Map<string, "asc" | "desc" | undefined>;

const useSearchParams = (schema: SearchParamsSchema) => {
  // -----------------------------------
  // Hooks / State
  const location = useLocation();
  const navigate = useNavigate();

  const [getInitialValuesSet, setInitialValuesSet] = createSignal(false);
  //   const [getSettled, setSettled] = createSignal(false);
  //   const [getSettledTimeout, setSettledTimeout] =
  //     createSignal<ReturnType<typeof setTimeout>>();

  const [getFilters, setFilters] = createSignal<FilterMap>(new Map());
  const [getSorts, setSorts] = createSignal<SortMap>(new Map());

  // -----------------------------------
  // Functions
  const filterValueToSting = (
    value?: string | number | string[] | number[]
  ) => {
    if (value === undefined) return undefined;
    else if (Array.isArray(value)) {
      if (value.length === 0) return undefined;
      return value.join(",");
    } else {
      return value.toString();
    }
  };

  const setLocation = (params: {
    filters?: SearchParamsSchema["filters"];
    sorts?: SearchParamsSchema["sorts"];
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

      // set sorts
      const sortsStr = sorts.map((sort) => sort.raw).join(",");
      if (sortsStr) {
        searchParams.set("sort", sortsStr);
      } else {
        searchParams.delete("sort");
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
        if (value) {
          // covert value back to array if it was an array
          const asArray = value.split(",");
          if (asArray.length > 0) {
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

    return searchParams.toString();
  };

  // Set initial values
  const setInitialParams = () => {
    setLocation({
      filters: schema.filters,
      sorts: schema.sorts,
    });
  };

  // -----------------------------------
  // Memos
  const getQueryString = createMemo(() => {
    if (!getInitialValuesSet()) {
      setInitialParams();
      setInitialValuesSet(true);
    }

    // on location change - update filters and sorts based on search params
    // return query string that is built from filters and sorts signals only
    const searchParams = new URLSearchParams(location.search);
    setStateFromLocation(searchParams);

    return buildQueryString();
  });

  // -----------------------------------
  // Return
  return {
    getFilters,
    getSorts,
    // getSettled,

    // on location change - update filters and sorts based on search params
    // return query string that is built from filters and sorts signals only
    getQueryString,

    // only set the location if the params are different
    // getQueryString handles updating the filters and sorts signals
    setParams: setLocation,
  };
};

export default useSearchParams;
