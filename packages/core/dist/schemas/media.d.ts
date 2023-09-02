import z from "zod";
declare const _default: {
    createSingle: {
        body: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            alt: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            name?: string | undefined;
            alt?: string | undefined;
        }, {
            name?: string | undefined;
            alt?: string | undefined;
        }>;
        query: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        params: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    };
    streamSingle: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{
            width: z.ZodOptional<z.ZodString>;
            height: z.ZodOptional<z.ZodString>;
            format: z.ZodOptional<z.ZodEnum<["jpeg", "png", "webp", "avif"]>>;
            quality: z.ZodOptional<z.ZodString>;
            fallback: z.ZodOptional<z.ZodEnum<["1", "0"]>>;
        }, "strip", z.ZodTypeAny, {
            width?: string | undefined;
            height?: string | undefined;
            format?: "jpeg" | "png" | "webp" | "avif" | undefined;
            quality?: string | undefined;
            fallback?: "1" | "0" | undefined;
        }, {
            width?: string | undefined;
            height?: string | undefined;
            format?: "jpeg" | "png" | "webp" | "avif" | undefined;
            quality?: string | undefined;
            fallback?: "1" | "0" | undefined;
        }>;
        params: z.ZodObject<{
            key: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            key: string;
        }, {
            key: string;
        }>;
    };
    getMultiple: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{
            filter: z.ZodOptional<z.ZodObject<{
                name: z.ZodOptional<z.ZodString>;
                key: z.ZodOptional<z.ZodString>;
                mime_type: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
                file_extension: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
            }, "strip", z.ZodTypeAny, {
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
            sort: z.ZodOptional<z.ZodArray<z.ZodObject<{
                key: z.ZodEnum<["created_at", "updated_at", "name", "file_size", "width", "height", "mime_type", "file_extension"]>;
                value: z.ZodEnum<["asc", "desc"]>;
            }, "strip", z.ZodTypeAny, {
                value: "desc" | "asc";
                key: "name" | "width" | "height" | "created_at" | "updated_at" | "mime_type" | "file_extension" | "file_size";
            }, {
                value: "desc" | "asc";
                key: "name" | "width" | "height" | "created_at" | "updated_at" | "mime_type" | "file_extension" | "file_size";
            }>, "many">>;
            page: z.ZodOptional<z.ZodString>;
            per_page: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            filter?: {
                name?: string | undefined;
                key?: string | undefined;
                mime_type?: string | string[] | undefined;
                file_extension?: string | string[] | undefined;
            } | undefined;
            sort?: {
                value: "desc" | "asc";
                key: "name" | "width" | "height" | "created_at" | "updated_at" | "mime_type" | "file_extension" | "file_size";
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
                value: "desc" | "asc";
                key: "name" | "width" | "height" | "created_at" | "updated_at" | "mime_type" | "file_extension" | "file_size";
            }[] | undefined;
            page?: string | undefined;
            per_page?: string | undefined;
        }>;
        params: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    };
    getSingle: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        params: z.ZodObject<{
            key: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            key: string;
        }, {
            key: string;
        }>;
    };
    deleteSingle: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        params: z.ZodObject<{
            key: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            key: string;
        }, {
            key: string;
        }>;
    };
    updateSingle: {
        body: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            alt: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            name?: string | undefined;
            alt?: string | undefined;
        }, {
            name?: string | undefined;
            alt?: string | undefined;
        }>;
        query: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        params: z.ZodObject<{
            key: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            key: string;
        }, {
            key: string;
        }>;
    };
    clearSingleProcessed: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        params: z.ZodObject<{
            key: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            key: string;
        }, {
            key: string;
        }>;
    };
    clearAllProcessed: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        params: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    };
};
export default _default;
//# sourceMappingURL=media.d.ts.map