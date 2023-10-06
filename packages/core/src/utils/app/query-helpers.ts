// -------------------------------------------
// Formats data for a query and removes undefined values and their corresponding columns

export const queryDataFormat = (data: {
  columns: string[];
  values: (any | undefined)[];
  conditional?: {
    hasValues?: {
      [key: string]:
        | string
        | number
        | boolean
        | Array<string | number | boolean>;
    };
  };
  flatValues?: boolean;
}) => {
  // Ensure columns and values have the same length
  if (!data.flatValues) {
    if (data.columns.length !== data.values.length) {
      throw new Error("Columns and values arrays must have the same length");
    }
  }

  // Filter out undefined values and their corresponding columns
  const filteredData = data.columns
    .map((col, i) => ({ col, val: data.values[i] }))
    .filter((data) => data.val !== undefined);

  const c = filteredData.map((data) => data.col);
  const v = filteredData.map((data) => data.val);

  let a: string[];
  if (data.flatValues) {
    // based on the column length, convert the values array into multiple arrays
    const groupedValues = [];
    const valueCopy = [...data.values];
    for (let i = 0; i < data.columns.length; i++) {
      const newGroup = valueCopy.splice(0, data.columns.length);
      if (newGroup.length === 0) break;
      groupedValues.push(newGroup);
    }

    a = groupedValues.map((_, i) => {
      const g = data.columns.map(
        (_, j) => `$${i * data.columns.length + j + 1}`
      );
      return `(${g.join(", ")})`;
    });
  } else {
    a = v.map((_, i) => `$${i + 1}`);
  }

  // -------------------------------------------
  // Conditionals
  if (data.conditional?.hasValues) {
    const hasValues = Object.entries(data.conditional.hasValues);
    for (let i = 0; i < hasValues.length; i++) {
      const [key, value] = hasValues[i];
      if (value === undefined) continue;
      c.push(key);
      v.push(value);
      a.push(`$${a.length + 1}`);
    }
  }

  // -------------------------------------------
  return {
    columns: {
      value: c,
      formatted: {
        insert: c.join(", "),
        update: c.map((col, i) => `${col} = ${a[i]}`).join(", "),
        doUpdate: c.map((col, i) => `${col} = EXCLUDED.${col}`).join(", "),
        insertMultiple: data.columns.join(", "),
      },
    },
    aliases: {
      value: a,
      formatted: {
        insert: a.join(", "),
        update: a.join(", "),
        insertMultiple: a.join(", "),
      },
    },
    values: {
      value: v,
      formatted: {
        insertMultiple: data.values,
      },
    },
  };
};

// -------------------------------------------
// Builds a query string for a SELECT statement and generated WHERE, ORDER BY, and LIMIT clauses etc.

interface SelectQueryBuilderConfig {
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
          | "@>"
          | "%";
        type: "int" | "string" | "boolean" | "text";
        columnType: "array" | "standard";
        key?: string;
        table?: string;
        exclude?: boolean;
      };
    };
  };
  sort?: {
    key: string;
    value: "asc" | "desc";
  }[];
  page?: string;
  per_page?: string;

  where?: string[];
  values?: Array<string | number | boolean | Array<string | number | boolean>>;
}

export class SelectQueryBuilder {
  config: SelectQueryBuilderConfig = {
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
  constructor(config: SelectQueryBuilderConfig) {
    this.config = config;
    this.values = config.values || [];

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
    const filterClauses: Array<string> = this.config.where || [];

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

      if (meta?.exclude) continue;

      const columnType = meta?.columnType || "standard";

      const baseKey = meta?.key || key;
      const keyV = meta?.table ? `${meta?.table}.${baseKey}` : baseKey;

      switch (columnType) {
        // -------------------------------------------
        // Column Type Array
        case "array": {
          filterClauses.push(
            `${keyV} ${meta?.operator || "@>"} $${this.values.length + 1}::${
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
              `${keyV} = ANY($${this.values.length + 1}::${
                meta?.type || "int"
              }[])`
            );
            this.values.push(this.#parseArrayValues(value));
            break;
          }
          // Is Single Value
          filterClauses.push(
            `${keyV} ${meta?.operator || "="} $${this.values.length + 1}`
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

// -------------------------------------------
// Generates alias form multi insert queries

interface AliasGeneratorConfig {
  columns: Array<{
    key: string;
    type?: "int" | "text" | "bool" | "jsonb" | "timestamp" | "int[]";
  }>;
  rows: number;
}

export const aliasGenerator = (config: AliasGeneratorConfig) => {
  const aliases = [];

  const colLength = config.columns.length;

  for (let i = 0; i < config.rows; i++) {
    const row = [];
    for (let j = 0; j < colLength; j++) {
      row.push(
        `$${i * colLength + j + 1}${
          config.columns[j].type ? `::${config.columns[j].type}` : ""
        }`
      );
    }
    aliases.push(`(${row.join(", ")})`);
  }

  return aliases.join(", ");
};
