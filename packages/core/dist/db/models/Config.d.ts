import z from "zod";
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
    static get bricks(): {
        key: string;
        title: string;
        fields: Map<string, import("@lucid/brick-builder").CustomField>;
        repeaterStack: string[];
        maxRepeaterDepth: number;
        addFields(BrickBuilder: any): any;
        endRepeater(): any;
        addTab(config: import("@lucid/brick-builder").TabConfig): any;
        addText: (config: import("@lucid/brick-builder").TextConfig) => any;
        addWysiwyg(config: import("@lucid/brick-builder").WysiwygConfig): any;
        addImage(config: import("@lucid/brick-builder").ImageConfig): any;
        addRepeater(config: import("@lucid/brick-builder").RepeaterConfig): any;
        addNumber(config: import("@lucid/brick-builder").NumberConfig): any;
        addCheckbox(config: import("@lucid/brick-builder").CheckboxConfig): any;
        addSelect(config: import("@lucid/brick-builder").SelectConfig): any;
        addTextarea(config: import("@lucid/brick-builder").TextareaConfig): any;
        addJSON(config: import("@lucid/brick-builder").JSONConfig): any;
        addFile(config: import("@lucid/brick-builder").FileConfig): any;
        addColour(config: import("@lucid/brick-builder").ColourConfig): any;
        addDateTime(config: import("@lucid/brick-builder").DateTimeConfig): any;
        addPageLink(config: import("@lucid/brick-builder").PageLinkConfig): any;
        addLink(config: import("@lucid/brick-builder").LinkConfig): any;
        readonly fieldTree: import("@lucid/brick-builder").CustomField[];
        readonly basicFieldTree: import("@lucid/brick-builder").CustomField[];
        readonly flatFields: import("@lucid/brick-builder").CustomField[];
        fieldValidation({ type, key, value, secondaryValue, }: {
            type: string;
            key: string;
            value: any;
            secondaryValue?: any;
        }): import("@lucid/brick-builder").ValidationResponse;
        "__#2@#validateSelectType"(field: import("@lucid/brick-builder").CustomField, { type, key, value, }: {
            type: string;
            key: string;
            value: string;
        }): import("@lucid/brick-builder").ValidationResponse;
        "__#2@#validateWysiwygType"(field: import("@lucid/brick-builder").CustomField, { type, key, value, }: {
            type: string;
            key: string;
            value: string;
        }): import("@lucid/brick-builder").ValidationResponse;
        "__#2@#validateImageType"(field: import("@lucid/brick-builder").CustomField, { type, key, value, }: {
            type: string;
            key: string;
            value: string;
        }): import("@lucid/brick-builder").ValidationResponse;
        "__#2@#validateFileType"(field: import("@lucid/brick-builder").CustomField, { type, key, value, }: {
            type: string;
            key: string;
            value: string;
        }): import("@lucid/brick-builder").ValidationResponse;
        "__#2@#validateDatetimeType"({ type, key, value, }: {
            type: string;
            key: string;
            value: string;
        }): import("@lucid/brick-builder").ValidationResponse;
        "__#2@#validateLinkTarget"(value: string): import("@lucid/brick-builder").ValidationResponse;
        "__#2@#validateRequired"(value: any): import("@lucid/brick-builder").ValidationResponse;
        "__#2@#validateType"(providedType: string, type: import("@lucid/brick-builder").FieldTypes): import("@lucid/brick-builder").ValidationResponse;
        "__#2@#validateZodSchema"(schema: z.ZodType<any, z.ZodTypeDef, any>, value: any): import("@lucid/brick-builder").ValidationResponse;
        "__#2@#validateIsString"(value: any): import("@lucid/brick-builder").ValidationResponse;
        "__#2@#validateIsNumber"(value: any): import("@lucid/brick-builder").ValidationResponse;
        "__#2@#validateIsBoolean"(value: any): import("@lucid/brick-builder").ValidationResponse;
        "__#2@#keyToTitle"(key: string): string;
        "__#2@#addToFields"(type: import("@lucid/brick-builder").FieldTypes, config: import("@lucid/brick-builder").FieldConfigs): void;
        "__#2@#checkKeyDuplication"(key: string): void;
    }[] | undefined;
    static get collections(): {
        key: string;
        config: {
            type: "pages" | "singlepage";
            title: string;
            singular: string;
            description: string | undefined;
            bricks: import("@lucid/collection-builder").CollectionBrickT[];
        };
        "__#3@#removeDuplicateBricks": () => void;
        "__#3@#addBrickDefaults": () => void;
        "__#3@#validateOptions": (options: import("@lucid/collection-builder").CollectionOptions) => void;
    }[] | undefined;
    static get postgresURL(): string;
    static get origin(): string;
}
export declare const buildConfig: (config: ConfigT) => ConfigT;
//# sourceMappingURL=Config.d.ts.map