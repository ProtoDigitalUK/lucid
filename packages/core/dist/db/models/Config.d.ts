import { BrickBuilderT } from "@lucid/brick-builder";
import { CollectionBuilderT } from "@lucid/collection-builder";
export type ConfigT = {
    port: number;
    origin?: string;
    environment: "development" | "production";
    databaseUrl: string;
    secretKey: string;
    collections?: CollectionBuilderT[];
    bricks?: BrickBuilderT[];
};
export default class Config {
    #private;
    private static _configCache;
    static validate: () => void;
    static findPath: (cwd: string) => string;
    static get: () => ConfigT;
    static get secretKey(): string;
    static get environment(): "development" | "production";
    static get databaseUrl(): string;
}
//# sourceMappingURL=Config.d.ts.map