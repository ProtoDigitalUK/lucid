import { Express } from "express";
import { BrickBuilderT } from "@lucid/brick-builder";
export type ConfigT = {
    port: number;
    origin?: string;
    environment: "development" | "production";
    secret_key: string;
    bricks?: BrickBuilderT[];
};
type ConfigValidate = (config: ConfigT) => Promise<void>;
type ConfigSet = (app: Express, config: ConfigT) => Promise<void>;
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