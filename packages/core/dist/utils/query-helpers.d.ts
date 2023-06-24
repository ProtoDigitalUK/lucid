export declare const queryDataFormat: (columns: string[], values: (any | undefined)[], conditional?: {
    hasValues?: {
        [key: string]: string | number | boolean | (string | number | boolean)[];
    } | undefined;
} | undefined) => {
    columns: {
        value: string[];
        formatted: {
            insert: string;
            update: string;
            doUpdate: string;
        };
    };
    aliases: {
        value: string[];
        formatted: {
            insert: string;
            update: string;
        };
    };
    values: {
        value: any[];
    };
};
interface SelectQueryBuilderConfig {
    columns: string[];
    exclude?: string[];
    filter?: {
        data?: {
            [key: string]: string | string[] | undefined;
        };
        meta?: {
            [key: string]: {
                operator: "=" | "!=" | "<" | ">" | "<=" | ">=" | "||" | "LIKE" | "ILIKE" | "SIMILAR TO" | "~" | "~*" | "BETWEEN" | "IN" | "@>";
                type: "int" | "string" | "boolean";
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
}
export declare class SelectQueryBuilder {
    #private;
    config: SelectQueryBuilderConfig;
    query: {
        select: string;
        where: string;
        order: string;
        pagination: string;
    };
    values: Array<string | number | boolean | Array<string | number | boolean>>;
    constructor(config: SelectQueryBuilderConfig);
    get countValues(): (string | number | boolean | (string | number | boolean)[])[];
}
export {};
//# sourceMappingURL=query-helpers.d.ts.map