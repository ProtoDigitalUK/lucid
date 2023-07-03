/// <reference types="express" />
import { ConfigT } from "./db/models/Config";
export type { ConfigT as Config };
declare const _default: {
    init: (config: InitConfig) => Promise<import("express").Express>;
    sendEmail: (template: string, params: import("./services/emails/send-email").EmailParamsT) => Promise<{
        success: boolean;
        message: string;
    }>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map