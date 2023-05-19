import z from "zod";
declare const _default: {
    schema: {
        body: z.ZodObject<{
            name: z.ZodString;
            active: z.ZodBoolean;
            items: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                name: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                name: string;
                id: string;
            }, {
                name: string;
                id: string;
            }>, "many">;
            person: z.ZodObject<{
                name: z.ZodString;
                age: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                name: string;
                age: number;
            }, {
                name: string;
                age: number;
            }>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            active: boolean;
            items: {
                name: string;
                id: string;
            }[];
            person: {
                name: string;
                age: number;
            };
        }, {
            name: string;
            active: boolean;
            items: {
                name: string;
                id: string;
            }[];
            person: {
                name: string;
                age: number;
            };
        }>;
        query: z.ZodObject<{
            include: z.ZodOptional<z.ZodString>;
            exclude: z.ZodOptional<z.ZodString>;
            filter: z.ZodOptional<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                active: z.ZodOptional<z.ZodEnum<["1", "-1"]>>;
            }, "strip", z.ZodTypeAny, {
                id?: string | undefined;
                active?: "1" | "-1" | undefined;
            }, {
                id?: string | undefined;
                active?: "1" | "-1" | undefined;
            }>>;
            sort: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            include?: string | undefined;
            exclude?: string | undefined;
            filter?: {
                id?: string | undefined;
                active?: "1" | "-1" | undefined;
            } | undefined;
            sort?: string | undefined;
        }, {
            include?: string | undefined;
            exclude?: string | undefined;
            filter?: {
                id?: string | undefined;
                active?: "1" | "-1" | undefined;
            } | undefined;
            sort?: string | undefined;
        }>;
        params: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    };
    controller: Controller<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>, z.ZodObject<{
        name: z.ZodString;
        active: z.ZodBoolean;
        items: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            id: string;
        }, {
            name: string;
            id: string;
        }>, "many">;
        person: z.ZodObject<{
            name: z.ZodString;
            age: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            name: string;
            age: number;
        }, {
            name: string;
            age: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        active: boolean;
        items: {
            name: string;
            id: string;
        }[];
        person: {
            name: string;
            age: number;
        };
    }, {
        name: string;
        active: boolean;
        items: {
            name: string;
            id: string;
        }[];
        person: {
            name: string;
            age: number;
        };
    }>, z.ZodObject<{
        include: z.ZodOptional<z.ZodString>;
        exclude: z.ZodOptional<z.ZodString>;
        filter: z.ZodOptional<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            active: z.ZodOptional<z.ZodEnum<["1", "-1"]>>;
        }, "strip", z.ZodTypeAny, {
            id?: string | undefined;
            active?: "1" | "-1" | undefined;
        }, {
            id?: string | undefined;
            active?: "1" | "-1" | undefined;
        }>>;
        sort: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        include?: string | undefined;
        exclude?: string | undefined;
        filter?: {
            id?: string | undefined;
            active?: "1" | "-1" | undefined;
        } | undefined;
        sort?: string | undefined;
    }, {
        include?: string | undefined;
        exclude?: string | undefined;
        filter?: {
            id?: string | undefined;
            active?: "1" | "-1" | undefined;
        } | undefined;
        sort?: string | undefined;
    }>>;
};
export default _default;
//# sourceMappingURL=throw-error.d.ts.map