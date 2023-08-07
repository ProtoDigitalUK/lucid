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

const useSearchParams2 = (schema: SearchParamsSchema) => {
  // -----------------------------------
  // Hooks / State
  const location = useLocation();
  const navigate = useNavigate();

  const [getFilters, setFilters] = createSignal<FilterMap>(new Map());
  const [getSorts, setSorts] = createSignal<SortMap>(new Map());

  // -----------------------------------
  // Functions
  const mergeFilters = (searchParams: URLSearchParams) => {
    // -----------------------------------
    // Sudo code

    // - add a priority value to the function, either prioritise search params state or filters state
    // - if prioritising search params state, update the filters state with the search params state
    // - if prioritising filters state, update the search params state with the filters state
    // - if there are no filters in the search params, sync with the schema filters

    // -----------------------------------
    // merge filters - remove bellow
    const filters = getFilters();
    for (const [key, value] of filters) {
      // if it exists in the search params, update the map
      if (searchParams.has(key)) {
        const spVal = searchParams.get(key);
        filters.set(key, spVal || undefined);
      } else {
        // otherwise, add it to the map
        searchParams.set(key, value as string);
      }
    }

    return searchParams;
  };
  const mergeSorts = (searchParams: URLSearchParams) => {
    console.log(searchParams);
  };

  const buildQueryString = (urlSearchParam?: URLSearchParams) => {
    const searchParams = urlSearchParam || new URLSearchParams();
    mergeFilters(searchParams);
    mergeSorts(searchParams);
    return searchParams.toString();
  };

  const updateFilterValue = (
    key: string,
    value: string | number | string[] | number[] | undefined
  ) => {
    const filters = getFilters();
    filters.set(key, value);
    setFilters(filters);
  };
  const updateSortValue = (key: string, value: "asc" | "desc" | undefined) => {
    const sorts = getSorts();
    sorts.set(key, value);
    setSorts(sorts);
  };

  const setInitialParams = () => {
    for (const [key, value] of Object.entries(schema.filters || {})) {
      updateFilterValue(key, value);
    }
    for (const [key, value] of Object.entries(schema.sorts || {})) {
      updateSortValue(key, value);
    }
  };
  setInitialParams();

  // -----------------------------------
  // Memos
  const getQueryString = createMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    console.log("searchParams", searchParams);

    const queryString = buildQueryString(searchParams);
    return queryString;
  });

  // -----------------------------------
  // Return
  return {
    getQueryString,
    getFilters,
    getSorts,

    setParams: (_params: {
      filters?: SearchParamsSchema["filters"];
      sorts?: SearchParamsSchema["sorts"];
    }) => {
      const filters = getFilters();
      if (filters) {
        for (const [key, value] of Object.entries(_params.filters || {})) {
          updateFilterValue(key, value);
        }
      }

      const sorts = getSorts();
      if (sorts) {
        for (const [key, value] of Object.entries(_params.sorts || {})) {
          updateSortValue(key, value);
        }
      }

      const queryString = buildQueryString();
      navigate(`?${queryString}`);
    },
  };
};

export default useSearchParams2;
