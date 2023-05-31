import { BrickBuilderT } from "@lucid/brick-builder";
export type ConfigT = {
    port: number;
    origin?: string;
    environment: "development" | "production";
    databaseUrl: string;
    secretKey: string;
    postTypes: Array<{
        key: string;
        name: string;
        singularName: string;
    }>;
    bricks?: BrickBuilderT[];
};
export default class Config {
    private static _configCache;
    static buildConfig: (config: ConfigT) => ConfigT;
    static validate: (config: ConfigT) => void;
    static findPath: (cwd: string) => string;
    static get: () => ConfigT;
    static get secretKey(): string;
    static get environment(): "development" | "production";
    static get databaseUrl(): string;
    static get postTypes(): {
        key: string;
        name: string;
        singularName: string;
    }[];
}
//# sourceMappingURL=Config.d.ts.map