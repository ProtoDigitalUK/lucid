import init from "./init.js";
import { ConfigT, buildConfig } from "./services/Config.js";
import BrickBuilder from "./builders/brick-builder/index.js";
import CollectionBuilder from "./builders/collection-builder/index.js";
import FormBuilder from "./builders/form-builder/index.js";
export type { ConfigT as Config };
declare const sendEmail: (template: string, params: import("./services/email/send-email.js").EmailParamsT, track?: boolean | undefined) => Promise<{
    success: boolean;
    message: string;
}>;
declare const submitForm: (props: import("./services/form-submissions/submit-form.js").ServiceData) => Promise<void>;
export { init, buildConfig, sendEmail, BrickBuilder, CollectionBuilder, FormBuilder, submitForm, };
declare const _default: {
    init: (options: InitOptions) => Promise<import("express").Express>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map