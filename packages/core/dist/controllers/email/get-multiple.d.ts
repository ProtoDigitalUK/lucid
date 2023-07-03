declare const _default: {
    schema: {
        body: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
        query: import("zod").ZodObject<{
            filter: import("zod").ZodOptional<import("zod").ZodObject<{
                to_address: import("zod").ZodOptional<import("zod").ZodString>;
                subject: import("zod").ZodOptional<import("zod").ZodString>;
                delivery_status: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodArray<import("zod").ZodString, "many">]>>;
            }, "strip", import("zod").ZodTypeAny, {
                to_address?: string | undefined;
                subject?: string | undefined;
                delivery_status?: string | string[] | undefined;
            }, {
                to_address?: string | undefined;
                subject?: string | undefined;
                delivery_status?: string | string[] | undefined;
            }>>;
            sort: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
                key: import("zod").ZodEnum<["created_at", "updated_at"]>;
                value: import("zod").ZodEnum<["asc", "desc"]>;
            }, "strip", import("zod").ZodTypeAny, {
                value: "asc" | "desc";
                key: "created_at" | "updated_at";
            }, {
                value: "asc" | "desc";
                key: "created_at" | "updated_at";
            }>, "many">>;
            page: import("zod").ZodOptional<import("zod").ZodString>;
            per_page: import("zod").ZodOptional<import("zod").ZodString>;
        }, "strip", import("zod").ZodTypeAny, {
            filter?: {
                to_address?: string | undefined;
                subject?: string | undefined;
                delivery_status?: string | string[] | undefined;
            } | undefined;
            sort?: {
                value: "asc" | "desc";
                key: "created_at" | "updated_at";
            }[] | undefined;
            page?: string | undefined;
            per_page?: string | undefined;
        }, {
            filter?: {
                to_address?: string | undefined;
                subject?: string | undefined;
                delivery_status?: string | string[] | undefined;
            } | undefined;
            sort?: {
                value: "asc" | "desc";
                key: "created_at" | "updated_at";
            }[] | undefined;
            page?: string | undefined;
            per_page?: string | undefined;
        }>;
        params: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
    };
    controller: Controller<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, import("zod").ZodObject<{
        filter: import("zod").ZodOptional<import("zod").ZodObject<{
            to_address: import("zod").ZodOptional<import("zod").ZodString>;
            subject: import("zod").ZodOptional<import("zod").ZodString>;
            delivery_status: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodArray<import("zod").ZodString, "many">]>>;
        }, "strip", import("zod").ZodTypeAny, {
            to_address?: string | undefined;
            subject?: string | undefined;
            delivery_status?: string | string[] | undefined;
        }, {
            to_address?: string | undefined;
            subject?: string | undefined;
            delivery_status?: string | string[] | undefined;
        }>>;
        sort: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
            key: import("zod").ZodEnum<["created_at", "updated_at"]>;
            value: import("zod").ZodEnum<["asc", "desc"]>;
        }, "strip", import("zod").ZodTypeAny, {
            value: "asc" | "desc";
            key: "created_at" | "updated_at";
        }, {
            value: "asc" | "desc";
            key: "created_at" | "updated_at";
        }>, "many">>;
        page: import("zod").ZodOptional<import("zod").ZodString>;
        per_page: import("zod").ZodOptional<import("zod").ZodString>;
    }, "strip", import("zod").ZodTypeAny, {
        filter?: {
            to_address?: string | undefined;
            subject?: string | undefined;
            delivery_status?: string | string[] | undefined;
        } | undefined;
        sort?: {
            value: "asc" | "desc";
            key: "created_at" | "updated_at";
        }[] | undefined;
        page?: string | undefined;
        per_page?: string | undefined;
    }, {
        filter?: {
            to_address?: string | undefined;
            subject?: string | undefined;
            delivery_status?: string | string[] | undefined;
        } | undefined;
        sort?: {
            value: "asc" | "desc";
            key: "created_at" | "updated_at";
        }[] | undefined;
        page?: string | undefined;
        per_page?: string | undefined;
    }>>;
};
export default _default;
//# sourceMappingURL=get-multiple.d.ts.map