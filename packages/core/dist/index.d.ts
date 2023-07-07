/// <reference types="express" />
import init from "./init";
import { ConfigT, buildConfig } from "./db/models/Config";
import { submitForm } from "./services/forms/submit-form";
import BrickBuilder from "@lucid/brick-builder";
import CollectionBuilder from "@lucid/collection-builder";
import FormBuilder from "@lucid/form-builder";
export type { ConfigT as Config };
declare const sendEmail: (template: string, params: import("./services/emails/send-email").EmailParamsT) => Promise<{
    success: boolean;
    message: string;
}>;
export { init, buildConfig, sendEmail, BrickBuilder, CollectionBuilder, FormBuilder, submitForm, };
declare const _default: {
    init: (app: import("express").Express) => Promise<import("express").Express>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map