import z from "zod";
declare const BaseMenuItemSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    url: z.ZodOptional<z.ZodString>;
    page_id: z.ZodOptional<z.ZodNumber>;
    name: z.ZodString;
    target: z.ZodOptional<z.ZodEnum<["_self", "_blank", "_parent", "_top"]>>;
    meta: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id?: number | undefined;
    url?: string | undefined;
    page_id?: number | undefined;
    target?: "_self" | "_blank" | "_parent" | "_top" | undefined;
    meta?: any;
}, {
    name: string;
    id?: number | undefined;
    url?: string | undefined;
    page_id?: number | undefined;
    target?: "_self" | "_blank" | "_parent" | "_top" | undefined;
    meta?: any;
}>;
declare const BaseMenuItemSchemaUpdate: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    url: z.ZodOptional<z.ZodString>;
    page_id: z.ZodOptional<z.ZodNumber>;
    name: z.ZodOptional<z.ZodString>;
    target: z.ZodOptional<z.ZodEnum<["_self", "_blank", "_parent", "_top"]>>;
    meta: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    id?: number | undefined;
    url?: string | undefined;
    page_id?: number | undefined;
    name?: string | undefined;
    target?: "_self" | "_blank" | "_parent" | "_top" | undefined;
    meta?: any;
}, {
    id?: number | undefined;
    url?: string | undefined;
    page_id?: number | undefined;
    name?: string | undefined;
    target?: "_self" | "_blank" | "_parent" | "_top" | undefined;
    meta?: any;
}>;
export type MenuItem = z.infer<typeof BaseMenuItemSchema> & {
    children?: MenuItem[];
};
export type MenuItemUpdate = z.infer<typeof BaseMenuItemSchemaUpdate> & {
    children?: MenuItem[];
};
export declare const MenuItem: z.ZodType<MenuItem>;
declare const _default: {
    createSingle: {
        body: z.ZodObject<{
            key: z.ZodString;
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            items: z.ZodOptional<z.ZodArray<z.ZodType<MenuItem, z.ZodTypeDef, MenuItem>, "many">>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            key: string;
            description?: string | undefined;
            items?: MenuItem[] | undefined;
        }, {
            name: string;
            key: string;
            description?: string | undefined;
            items?: MenuItem[] | undefined;
        }>;
        query: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        params: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    };
    deleteSingle: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        params: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
    };
    getSingle: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        params: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
    };
    getMultiple: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{
            filter: z.ZodOptional<z.ZodObject<{
                name: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                name?: string | undefined;
            }, {
                name?: string | undefined;
            }>>;
            sort: z.ZodOptional<z.ZodArray<z.ZodObject<{
                key: z.ZodEnum<["created_at"]>;
                value: z.ZodEnum<["asc", "desc"]>;
            }, "strip", z.ZodTypeAny, {
                value: "desc" | "asc";
                key: "created_at";
            }, {
                value: "desc" | "asc";
                key: "created_at";
            }>, "many">>;
            include: z.ZodOptional<z.ZodArray<z.ZodEnum<["items"]>, "many">>;
            page: z.ZodOptional<z.ZodString>;
            per_page: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            filter?: {
                name?: string | undefined;
            } | undefined;
            sort?: {
                value: "desc" | "asc";
                key: "created_at";
            }[] | undefined;
            include?: "items"[] | undefined;
            page?: string | undefined;
            per_page?: string | undefined;
        }, {
            filter?: {
                name?: string | undefined;
            } | undefined;
            sort?: {
                value: "desc" | "asc";
                key: "created_at";
            }[] | undefined;
            include?: "items"[] | undefined;
            page?: string | undefined;
            per_page?: string | undefined;
        }>;
        params: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    };
    updateSingle: {
        body: z.ZodObject<{
            key: z.ZodOptional<z.ZodString>;
            name: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            items: z.ZodOptional<z.ZodArray<z.ZodType<MenuItemUpdate, z.ZodTypeDef, MenuItemUpdate>, "many">>;
        }, "strip", z.ZodTypeAny, {
            key?: string | undefined;
            name?: string | undefined;
            description?: string | undefined;
            items?: MenuItemUpdate[] | undefined;
        }, {
            key?: string | undefined;
            name?: string | undefined;
            description?: string | undefined;
            items?: MenuItemUpdate[] | undefined;
        }>;
        query: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        params: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
    };
};
export default _default;
//# sourceMappingURL=menus.d.ts.map