import { BrickBuilderT } from "@lucid/brick-builder";
import { CollectionBuilderT } from "@lucid/collection-builder";
import { FormBuilderT } from "@lucid/form-builder";
export type ConfigT = {
    host: string;
    origin: string;
    mode: "development" | "production";
    postgresURL: string;
    secret: string;
    forms?: FormBuilderT[];
    collections?: CollectionBuilderT[];
    bricks?: BrickBuilderT[];
    media: {
        storageLimit?: number;
        maxFileSize?: number;
        fallbackImage?: string | false;
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
    static get media(): {
        storageLimit: number;
        maxFileSize: number;
        fallbackImage: string | false | undefined;
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
    static get forms(): import("@lucid/form-builder").default[] | undefined;
    static get host(): string;
}
export declare const buildConfig: (config: ConfigT) => ConfigT;
//# sourceMappingURL=Config.d.ts.map