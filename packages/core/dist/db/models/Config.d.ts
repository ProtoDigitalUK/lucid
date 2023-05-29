import { Express } from "express";
import { BrickBuilderT } from "@lucid/brick-builder";
export type ConfigT = {
    port: number;
    origin?: string;
    environment: "development" | "production";
    secretKey: string;
    postTypes: Array<{
        key: string;
        name: string;
        singularName: string;
    }>;
    bricks?: BrickBuilderT[];
};
type ConfigValidate = (config: ConfigT) => Promise<void>;
type ConfigSet = (app: Express, config: ConfigT) => Promise<void>;
type ConfigGet = () => ConfigT;
export default class Config {
    static validate: ConfigValidate;
    static set: ConfigSet;
    static get: ConfigGet;
    static get secretKey(): string;
    static get environment(): "development" | "production";
    static get databaseUrl(): string;
    static get postTypes(): {
        key: string;
        name: string;
        singularName: string;
    }[];
}
export {};
//# sourceMappingURL=Config.d.ts.map