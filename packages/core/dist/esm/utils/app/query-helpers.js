export const queryDataFormat = (data) => {
    if (!data.flatValues) {
        if (data.columns.length !== data.values.length) {
            throw new Error("Columns and values arrays must have the same length");
        }
    }
    const filteredData = data.columns
        .map((col, i) => ({ col, val: data.values[i] }))
        .filter((data) => data.val !== undefined);
    const c = filteredData.map((data) => data.col);
    const v = filteredData.map((data) => data.val);
    let a;
    if (data.flatValues) {
        const groupedValues = [];
        const valueCopy = [...data.values];
        for (let i = 0; i < data.columns.length; i++) {
            const newGroup = valueCopy.splice(0, data.columns.length);
            if (newGroup.length === 0)
                break;
            groupedValues.push(newGroup);
        }
        a = groupedValues.map((_, i) => {
            const g = data.columns.map((_, j) => `$${i * data.columns.length + j + 1}`);
            return `(${g.join(", ")})`;
        });
    }
    else {
        a = v.map((_, i) => `$${i + 1}`);
    }
    if (data.conditional?.hasValues) {
        const hasValues = Object.entries(data.conditional.hasValues);
        for (let i = 0; i < hasValues.length; i++) {
            const [key, value] = hasValues[i];
            if (value === undefined)
                continue;
            c.push(key);
            v.push(value);
            a.push(`$${a.length + 1}`);
        }
    }
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
export class SelectQueryBuilder {
    config = {
        columns: [],
    };
    query = {
        select: "",
        where: "",
        order: "",
        pagination: "",
    };
    values = [];
    constructor(config) {
        this.config = config;
        this.#buildSelect();
        this.#buildFilter();
        this.#buildOrder();
        this.#buildPagination();
    }
    #buildSelect() {
        if (!this.config.exclude) {
            this.config.columns.forEach((column, index) => {
                this.query.select += `${column}${index < this.config.columns.length - 1 ? ", " : ""}`;
            });
        }
        else {
            this.config.columns.forEach((column, index) => {
                if (this.config.exclude?.includes(column))
                    return;
                this.query.select += `${column}${index < this.config.columns.length - 1 ? ", " : ""}`;
            });
        }
    }
    #buildFilter() {
        const filterClauses = [];
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
            if (value === undefined)
                continue;
            const meta = this.config.filter.meta
                ? this.config.filter.meta[key]
                : undefined;
            if (meta?.exclude)
                continue;
            const columnType = meta?.columnType || "standard";
            const baseKey = meta?.key || key;
            const keyV = meta?.table ? `${meta?.table}.${baseKey}` : baseKey;
            switch (columnType) {
                case "array": {
                    filterClauses.push(`${keyV} ${meta?.operator || "@>"} $${this.values.length + 1}::${meta?.type || "int"}[]`);
                    this.values.push(this.#parseArrayValues(Array.isArray(value) ? value : [value]));
                    break;
                }
                default: {
                    if (Array.isArray(value)) {
                        filterClauses.push(`${keyV} = ANY($${this.values.length + 1}::${meta?.type || "int"}[])`);
                        this.values.push(this.#parseArrayValues(value));
                        break;
                    }
                    filterClauses.push(`${keyV} ${meta?.operator || "="} $${this.values.length + 1}`);
                    this.values.push(this.#parseSingleValue(value));
                    break;
                }
            }
        }
        this.query.where =
            filterClauses.length > 0 ? "WHERE " + filterClauses.join(" AND ") : "";
    }
    #buildOrder() {
        if (!this.config.sort)
            return;
        let query = "";
        this.config.sort.forEach((sort, index) => {
            query += `${sort.key} ${sort.value.toUpperCase()}${index < (this.config.sort?.length || 0) - 1 ? ", " : ""}`;
        });
        this.query.order = `ORDER BY ${query}`;
    }
    #buildPagination() {
        if (!this.config.page || !this.config.per_page)
            return;
        if (this.config.per_page === "-1")
            return;
        const offset = (Number(this.config.page) - 1) * Number(this.config.per_page);
        this.query.pagination = `LIMIT $${this.values.length + 1}`;
        this.values.push(Number(this.config.per_page));
        this.query.pagination += ` OFFSET $${this.values.length + 1}`;
        this.values.push(offset);
    }
    #parseArrayValues(arr) {
        return arr.map((v) => {
            return this.#parseSingleValue(v);
        });
    }
    #parseSingleValue(v) {
        if (typeof v != "string")
            return v;
        if (v === "true")
            return true;
        if (v === "false")
            return false;
        if (!isNaN(Number(v))) {
            return Number(v);
        }
        else {
            return v;
        }
    }
    get countValues() {
        if (this.query.pagination) {
            return this.values.slice(0, this.values.length - 2);
        }
        return this.values;
    }
}
//# sourceMappingURL=query-helpers.js.map