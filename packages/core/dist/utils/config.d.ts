import z from "zod";
declare const configSchema: z.ZodObject<{
    port: z.ZodNumber;
    database_url: z.ZodString;
    origin: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    port: number;
    database_url: string;
    origin?: string | undefined;
}, {
    port: number;
    database_url: string;
    origin?: string | undefined;
}>;
export type ConfigT = z.infer<typeof configSchema>;
export default class Config {
    static validate: (config: ConfigT) => Promise<void>;
    static set: (config: ConfigT) => Promise<void>;
    static get: () => {
        port: number;
        database_url: string;
        origin?: string | undefined;
    };
    static get database_url(): string;
}
export {};
//# sourceMappingURL=config.d.ts.map