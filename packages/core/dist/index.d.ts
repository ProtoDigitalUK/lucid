/// <reference types="express" />
import init from "./init";
import { ConfigT, buildConfig } from "./db/models/Config";
export type { ConfigT as Config };
declare const sendEmail: (template: string, params: import("./services/emails/send-email").EmailParamsT) => Promise<{
    success: boolean;
    message: string;
}>;
export { init, buildConfig, sendEmail };
declare const _default: {
    init: (app: import("express").Express) => Promise<import("express").Express>;
    buildConfig: (config: ConfigT) => ConfigT;
    sendEmail: (template: string, params: import("./services/emails/send-email").EmailParamsT) => Promise<{
        success: boolean;
        message: string;
    }>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map