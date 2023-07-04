/// <reference types="express" />
import init from "./init";
import { ConfigT, buildConfig } from "./db/models/Config";
export type { ConfigT as Config };
declare const sendEmail: (template: string, params: import("./services/emails/send-email").EmailParamsT, id?: number | undefined) => Promise<{
    success: boolean;
    message: string;
}>;
export { init, buildConfig, sendEmail };
declare const _default: {
    init: (config: InitConfig) => Promise<import("express").Express>;
    buildConfig: (config: ConfigT) => ConfigT;
    sendEmail: (template: string, params: import("./services/emails/send-email").EmailParamsT, id?: number | undefined) => Promise<{
        success: boolean;
        message: string;
    }>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map