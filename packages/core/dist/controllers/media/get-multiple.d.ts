declare const _default: {
    schema: {
        body: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
        query: import("zod").ZodObject<{
            filter: import("zod").ZodOptional<import("zod").ZodObject<{
                name: import("zod").ZodOptional<import("zod").ZodString>;
                key: import("zod").ZodOptional<import("zod").ZodString>;
                mime_type: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodArray<import("zod").ZodString, "many">]>>;
                file_extension: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodArray<import("zod").ZodString, "many">]>>;
            }, "strip", import("zod").ZodTypeAny, {
                name?: string | undefined;
                key?: string | undefined;
                mime_type?: string | string[] | undefined;
                file_extension?: string | string[] | undefined;
            }, {
                name?: string | undefined;
                key?: string | undefined;
                mime_type?: string | string[] | undefined;
                file_extension?: string | string[] | undefined;
            }>>;
            sort: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
                key: import("zod").ZodEnum<["created_at", "updated_at", "name", "file_size", "width", "height", "mime_type", "file_extension"]>;
                value: import("zod").ZodEnum<["asc", "desc"]>;
            }, "strip", import("zod").ZodTypeAny, {
                value: "asc" | "desc";
                key: "name" | "width" | "height" | "created_at" | "mime_type" | "file_extension" | "file_size" | "updated_at";
            }, {
                value: "asc" | "desc";
                key: "name" | "width" | "height" | "created_at" | "mime_type" | "file_extension" | "file_size" | "updated_at";
            }>, "many">>;
            page: import("zod").ZodOptional<import("zod").ZodString>;
            per_page: import("zod").ZodOptional<import("zod").ZodString>;
        }, "strip", import("zod").ZodTypeAny, {
            filter?: {
                name?: string | undefined;
                key?: string | undefined;
                mime_type?: string | string[] | undefined;
                file_extension?: string | string[] | undefined;
            } | undefined;
            sort?: {
                value: "asc" | "desc";
                key: "name" | "width" | "height" | "created_at" | "mime_type" | "file_extension" | "file_size" | "updated_at";
            }[] | undefined;
            page?: string | undefined;
            per_page?: string | undefined;
        }, {
            filter?: {
                name?: string | undefined;
                key?: string | undefined;
                mime_type?: string | string[] | undefined;
                file_extension?: string | string[] | undefined;
            } | undefined;
            sort?: {
                value: "asc" | "desc";
                key: "name" | "width" | "height" | "created_at" | "mime_type" | "file_extension" | "file_size" | "updated_at";
            }[] | undefined;
            page?: string | undefined;
            per_page?: string | undefined;
        }>;
        params: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
    };
    controller: Controller<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, import("zod").ZodObject<{
        filter: import("zod").ZodOptional<import("zod").ZodObject<{
            name: import("zod").ZodOptional<import("zod").ZodString>;
            key: import("zod").ZodOptional<import("zod").ZodString>;
            mime_type: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodArray<import("zod").ZodString, "many">]>>;
            file_extension: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodArray<import("zod").ZodString, "many">]>>;
        }, "strip", import("zod").ZodTypeAny, {
            name?: string | undefined;
            key?: string | undefined;
            mime_type?: string | string[] | undefined;
            file_extension?: string | string[] | undefined;
        }, {
            name?: string | undefined;
            key?: string | undefined;
            mime_type?: string | string[] | undefined;
            file_extension?: string | string[] | undefined;
        }>>;
        sort: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
            key: import("zod").ZodEnum<["created_at", "updated_at", "name", "file_size", "width", "height", "mime_type", "file_extension"]>;
            value: import("zod").ZodEnum<["asc", "desc"]>;
        }, "strip", import("zod").ZodTypeAny, {
            value: "asc" | "desc";
            key: "name" | "width" | "height" | "created_at" | "mime_type" | "file_extension" | "file_size" | "updated_at";
        }, {
            value: "asc" | "desc";
            key: "name" | "width" | "height" | "created_at" | "mime_type" | "file_extension" | "file_size" | "updated_at";
        }>, "many">>;
        page: import("zod").ZodOptional<import("zod").ZodString>;
        per_page: import("zod").ZodOptional<import("zod").ZodString>;
    }, "strip", import("zod").ZodTypeAny, {
        filter?: {
            name?: string | undefined;
            key?: string | undefined;
            mime_type?: string | string[] | undefined;
            file_extension?: string | string[] | undefined;
        } | undefined;
        sort?: {
            value: "asc" | "desc";
            key: "name" | "width" | "height" | "created_at" | "mime_type" | "file_extension" | "file_size" | "updated_at";
        }[] | undefined;
        page?: string | undefined;
        per_page?: string | undefined;
    }, {
        filter?: {
            name?: string | undefined;
            key?: string | undefined;
            mime_type?: string | string[] | undefined;
            file_extension?: string | string[] | undefined;
        } | undefined;
        sort?: {
            value: "asc" | "desc";
            key: "name" | "width" | "height" | "created_at" | "mime_type" | "file_extension" | "file_size" | "updated_at";
        }[] | undefined;
        page?: string | undefined;
        per_page?: string | undefined;
    }>>;
};
export default _default;
//# sourceMappingURL=get-multiple.d.ts.map