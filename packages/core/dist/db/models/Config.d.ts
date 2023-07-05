import { BrickBuilderT } from "@lucid/brick-builder";
import { CollectionBuilderT } from "@lucid/collection-builder";
export type ConfigT = {
    origin: string;
    mode: "development" | "production";
    postgresURL: string;
    secret: string;
    environments: Array<{
        title: string;
        key: string;
    }>;
    collections?: CollectionBuilderT[];
    bricks?: BrickBuilderT[];
    media: {
        storageLimit?: number;
        maxFileSize?: number;
        store: {
            service: "aws" | "cloudflare";
            cloudflareAccountId?: string;
            region?: string;
            bucket: string;
            accessKeyId: string;
            secretAccessKey: string;
        };
    };
    email?: {
        from: {
            name: string;
            email: string;
        };
        templateDir?: string;
        smtp?: {
            host: string;
            port: number;
            user: string;
            pass: string;
            secure?: boolean;
        };
    };
};
export default class Config {
    #private;
    private static _configCache;
    static validate: (config: ConfigT) => void;
    static findPath: (cwd: string) => string;
    static getConfig: () => Promise<ConfigT>;
    static cacheConfig: () => Promise<ConfigT>;
    static get configCache(): ConfigT;
    static get mode(): "development" | "production";
    static get environments(): {
        title: string;
        key: string;
    }[];
    static get media(): {
        storageLimit: number;
        maxFileSize: number;
        store: {
            service: "aws" | "cloudflare";
            cloudflareAccountId: string | undefined;
            region: string | undefined;
            bucket: string;
            accessKeyId: string;
            secretAccessKey: string;
        };
    };
    static get email(): {
        from: {
            name: string;
            email: string;
        };
        templateDir?: string | undefined;
        smtp?: {
            host: string;
            port: number;
            user: string;
            pass: string;
            secure?: boolean | undefined;
        } | undefined;
    } | undefined;
    static get secret(): string;
    static get bricks(): import("@lucid/brick-builder").default[] | undefined;
    static get collections(): import("@lucid/collection-builder").default[] | undefined;
    static get postgresURL(): string;
    static get origin(): string;
}
export declare const buildConfig: (config: ConfigT) => ConfigT;
//# sourceMappingURL=Config.d.ts.map