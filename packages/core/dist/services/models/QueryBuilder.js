"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _QueryBuilder_instances, _QueryBuilder_buildSelect, _QueryBuilder_buildFilter, _QueryBuilder_buildOrder, _QueryBuilder_buildPagination, _QueryBuilder_parseArrayValues, _QueryBuilder_parseSingleValue;
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuilder {
    constructor(config) {
        _QueryBuilder_instances.add(this);
        this.config = {
            columns: [],
        };
        this.query = {
            select: "",
            where: "",
            order: "",
            pagination: "",
        };
        this.values = [];
        this.config = config;
        __classPrivateFieldGet(this, _QueryBuilder_instances, "m", _QueryBuilder_buildSelect).call(this);
        __classPrivateFieldGet(this, _QueryBuilder_instances, "m", _QueryBuilder_buildFilter).call(this);
        __classPrivateFieldGet(this, _QueryBuilder_instances, "m", _QueryBuilder_buildOrder).call(this);
        __classPrivateFieldGet(this, _QueryBuilder_instances, "m", _QueryBuilder_buildPagination).call(this);
    }
    get countValues() {
        if (this.query.pagination) {
            return this.values.slice(0, this.values.length - 2);
        }
        return this.values;
    }
}
exports.default = QueryBuilder;
_QueryBuilder_instances = new WeakSet(), _QueryBuilder_buildSelect = function _QueryBuilder_buildSelect() {
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
}, _QueryBuilder_buildFilter = function _QueryBuilder_buildFilter() {
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
        const keyV = meta?.table ? `${meta?.table}.${key}` : key;
        switch (columnType) {
            case "array": {
                filterClauses.push(`${keyV} ${meta?.operator || "@>"} $${this.values.length + 1}::${meta?.type || "int"}[]`);
                this.values.push(__classPrivateFieldGet(this, _QueryBuilder_instances, "m", _QueryBuilder_parseArrayValues).call(this, Array.isArray(value) ? value : [value]));
                break;
            }
            default: {
                if (Array.isArray(value)) {
                    filterClauses.push(`${keyV} = ANY($${this.values.length + 1}::${meta?.type || "int"}[])`);
                    this.values.push(__classPrivateFieldGet(this, _QueryBuilder_instances, "m", _QueryBuilder_parseArrayValues).call(this, value));
                    break;
                }
                filterClauses.push(`${keyV} ${meta?.operator || "="} $${this.values.length + 1}`);
                this.values.push(__classPrivateFieldGet(this, _QueryBuilder_instances, "m", _QueryBuilder_parseSingleValue).call(this, value));
                break;
            }
        }
    }
    this.query.where =
        filterClauses.length > 0 ? "WHERE " + filterClauses.join(" AND ") : "";
}, _QueryBuilder_buildOrder = function _QueryBuilder_buildOrder() {
    if (!this.config.sort)
        return;
    let query = "";
    this.config.sort.forEach((sort, index) => {
        query += `${sort.key} ${sort.value.toUpperCase()}${index < (this.config.sort?.length || 0) - 1 ? ", " : ""}`;
    });
    this.query.order = `ORDER BY ${query}`;
}, _QueryBuilder_buildPagination = function _QueryBuilder_buildPagination() {
    if (!this.config.page || !this.config.per_page)
        return;
    if (this.config.per_page === "-1")
        return;
    const offset = (Number(this.config.page) - 1) * Number(this.config.per_page);
    this.query.pagination = `LIMIT $${this.values.length + 1}`;
    this.values.push(Number(this.config.per_page));
    this.query.pagination += ` OFFSET $${this.values.length + 1}`;
    this.values.push(offset);
}, _QueryBuilder_parseArrayValues = function _QueryBuilder_parseArrayValues(arr) {
    return arr.map((v) => {
        return __classPrivateFieldGet(this, _QueryBuilder_instances, "m", _QueryBuilder_parseSingleValue).call(this, v);
    });
}, _QueryBuilder_parseSingleValue = function _QueryBuilder_parseSingleValue(v) {
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
};
//# sourceMappingURL=QueryBuilder.js.map