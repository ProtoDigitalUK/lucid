interface QueryBuilderConfig {
  columns: string[];
  exclude?: string[];
  filter?: {
    data?: {
      [key: string]: string | string[] | undefined;
    };
    meta?: {
      [key: string]: {
        operator:
          | "="
          | "!="
          | "<"
          | ">"
          | "<="
          | ">="
          | "||"
          | "LIKE"
          | "ILIKE"
          | "SIMILAR TO"
          | "~"
          | "~*"
          | "BETWEEN"
          | "IN"
          | "@>";
        type: "int" | "string" | "boolean";
        columnType: "array" | "standard";
      };
    };
  };
  sort?: {
    key: string;
    value: "asc" | "desc";
  }[];
  page?: string;
  per_page?: string;
}

export default class QueryBuilder {
  config: QueryBuilderConfig = {
    columns: [],
  };
  query = {
    select: "",
    where: "",
    order: "",
    pagination: "",
  };
  values: Array<string | number | boolean | Array<string | number | boolean>> =
    [];
  constructor(config: QueryBuilderConfig) {
    this.config = config;
    this.#buildSelect();
    this.#buildFilter();
    this.#buildOrder();
    this.#buildPagination();
  }
  // -------------------------------------------
  // Methods
  #buildSelect() {
    if (!this.config.exclude) {
      this.config.columns.forEach((column, index) => {
        this.query.select += `${column}${
          index < this.config.columns.length - 1 ? ", " : ""
        }`;
      });
    } else {
      this.config.columns.forEach((column, index) => {
        if (this.config.exclude?.includes(column)) return;
        this.query.select += `${column}${
          index < this.config.columns.length - 1 ? ", " : ""
        }`;
      });
    }
  }
  #buildFilter() {
    const filterClauses: Array<string> = [];

    if (!this.config.filter?.data) {
      this.query.where = "";
      this.values = [];
      return;
    }

    const filters = Object.entries(this.config.filter.data);
    if (!filters) {
      this.query.where = "";
      this.values = [];
      return;
    }

    for (let i = 0; i < filters.length; i++) {
      const [key, value] = filters[i];
      if (value === undefined) continue;
      const meta = this.config.filter.meta
        ? this.config.filter.meta[key]
        : undefined;

      const columnType = meta?.columnType || "standard";

      switch (columnType) {
        // -------------------------------------------
        // Column Type Array
        case "array": {
          filterClauses.push(
            `${key} ${meta?.operator || "@>"} $${this.values.length + 1}::${
              meta?.type || "int"
            }[]`
          );
          this.values.push(
            this.#parseArrayValues(Array.isArray(value) ? value : [value])
          );
          break;
        }
        // -------------------------------------------
        // Column Type Standard
        default: {
          if (Array.isArray(value)) {
            filterClauses.push(
              `${key} = ANY($${this.values.length + 1}::${
                meta?.type || "int"
              }[])`
            );
            this.values.push(this.#parseArrayValues(value));
            break;
          }
          // Is Single Value
          filterClauses.push(
            `${key} ${meta?.operator || "="} $${this.values.length + 1}`
          );
          this.values.push(this.#parseSingleValue(value));
          break;
        }
      }
    }

    this.query.where =
      filterClauses.length > 0 ? "WHERE " + filterClauses.join(" AND ") : "";
  }
  #buildOrder() {
    if (!this.config.sort) return;
    let query = "";

    this.config.sort.forEach((sort, index) => {
      query += `${sort.key} ${sort.value.toUpperCase()}${
        index < (this.config.sort?.length || 0) - 1 ? ", " : ""
      }`;
    });

    this.query.order = `ORDER BY ${query}`;
  }
  #buildPagination() {
    if (!this.config.page || !this.config.per_page) return;
    if (this.config.per_page === "-1") return;

    const offset =
      (Number(this.config.page) - 1) * Number(this.config.per_page);

    this.query.pagination = `LIMIT $${this.values.length + 1}`;
    this.values.push(Number(this.config.per_page));
    this.query.pagination += ` OFFSET $${this.values.length + 1}`;
    this.values.push(offset);
  }

  // -------------------------------------------
  // Helpers
  #parseArrayValues(arr: Array<string>) {
    return arr.map((v) => {
      return this.#parseSingleValue(v);
    });
  }
  #parseSingleValue(v: string) {
    if (typeof v != "string") return v;
    if (v === "true") return true;
    if (v === "false") return false;
    if (!isNaN(Number(v))) {
      return Number(v);
    } else {
      return v;
    }
  }
  // -------------------------------------------
  // Getters
  get countValues() {
    // check if there is a pagination via the query.pagination
    // if there is, remove the last two values from the array and return it
    // else return the array as is
    if (this.query.pagination) {
      return this.values.slice(0, this.values.length - 2);
    }
    return this.values;
  }
}
