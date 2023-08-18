import init from "./init";
import { ConfigT, buildConfig } from "./services/Config";
import BrickBuilder from "@lucid/brick-builder";
import CollectionBuilder from "@lucid/collection-builder";
import FormBuilder from "@lucid/form-builder";
export type { ConfigT as Config };
declare const sendEmail: (template: string, params: import("./services/email/send-email").EmailParamsT, track?: boolean | undefined) => Promise<{
    success: boolean;
    message: string;
}>;
declare const submitForm: (props: import("./services/form-submissions/submit-form").ServiceData) => Promise<void>;
export { init, buildConfig, sendEmail, BrickBuilder, CollectionBuilder, FormBuilder, submitForm, };
declare const _default: {
    init: (options: InitOptions) => Promise<import("express").Express>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map