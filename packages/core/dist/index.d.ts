/// <reference types="express" />
import init from "./init";
import { ConfigT, buildConfig } from "./db/models/Config";
import BrickBuilder from "@lucid/brick-builder";
import CollectionBuilder from "@lucid/collection-builder";
import FormBuilder from "@lucid/form-builder";
export type { ConfigT as Config };
declare const sendEmail: (template: string, params: import("./services/emails/send-email").EmailParamsT) => Promise<{
    success: boolean;
    message: string;
}>;
export { init, buildConfig, sendEmail, BrickBuilder, CollectionBuilder, FormBuilder, };
declare const _default: {
    init: (app: import("express").Express) => Promise<import("express").Express>;
    buildConfig: (config: ConfigT) => ConfigT;
    sendEmail: (template: string, params: import("./services/emails/send-email").EmailParamsT) => Promise<{
        success: boolean;
        message: string;
    }>;
    BrickBuilder: typeof BrickBuilder;
    CollectionBuilder: typeof CollectionBuilder;
    FormBuilder: typeof FormBuilder;
};
export default _default;
//# sourceMappingURL=index.d.ts.map