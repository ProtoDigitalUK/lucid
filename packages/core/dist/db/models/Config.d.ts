import z from "zod";
declare const configSchema: z.ZodObject<{
    port: z.ZodNumber;
    origin: z.ZodOptional<z.ZodString>;
    environment: z.ZodEnum<["development", "production"]>;
    secret_key: z.ZodString;
}, "strip", z.ZodTypeAny, {
    port: number;
    environment: "development" | "production";
    secret_key: string;
    origin?: string | undefined;
}, {
    port: number;
    environment: "development" | "production";
    secret_key: string;
    origin?: string | undefined;
}>;
export type ConfigT = z.infer<typeof configSchema>;
type ConfigValidate = (config: ConfigT) => Promise<void>;
type ConfigSet = (config: ConfigT) => Promise<void>;
type ConfigGet = () => ConfigT;
export default class Config {
    static validate: ConfigValidate;
    static set: ConfigSet;
    static get: ConfigGet;
    static get secret_key(): string;
    static get environment(): "development" | "production";
    static get database_url(): string;
}
export {};
//# sourceMappingURL=Config.d.ts.map