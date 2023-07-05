/// <reference types="express" />
import init from "./init";
import { ConfigT, buildConfig } from "./db/models/Config";
import BrickBuilder from "@lucid/brick-builder";
import CollectionBuilder from "@lucid/collection-builder";
export type { ConfigT as Config };
declare const sendEmail: (template: string, params: import("./services/emails/send-email").EmailParamsT) => Promise<{
    success: boolean;
    message: string;
}>;
export { init, buildConfig, sendEmail, BrickBuilder, CollectionBuilder };
declare const _default: {
    init: (app: import("express").Express) => Promise<import("express").Express>;
    buildConfig: (config: ConfigT) => ConfigT;
    sendEmail: (template: string, params: import("./services/emails/send-email").EmailParamsT) => Promise<{
        success: boolean;
        message: string;
    }>;
    BrickBuilder: {
        new (key: string, config?: import("@lucid/brick-builder").BrickConfig | undefined): {
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
            "__#2@#validateZodSchema"(schema: import("zod").ZodType<any, import("zod").ZodTypeDef, any>, value: any): import("@lucid/brick-builder").ValidationResponse;
            "__#2@#validateIsString"(value: any): import("@lucid/brick-builder").ValidationResponse;
            "__#2@#validateIsNumber"(value: any): import("@lucid/brick-builder").ValidationResponse;
            "__#2@#validateIsBoolean"(value: any): import("@lucid/brick-builder").ValidationResponse;
            "__#2@#keyToTitle"(key: string): string;
            "__#2@#addToFields"(type: import("@lucid/brick-builder").FieldTypes, config: import("@lucid/brick-builder").FieldConfigs): void;
            "__#2@#checkKeyDuplication"(key: string): void;
        };
    };
    CollectionBuilder: {
        new (key: string, options: import("@lucid/collection-builder").CollectionOptions): {
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
        };
    };
};
export default _default;
//# sourceMappingURL=index.d.ts.map