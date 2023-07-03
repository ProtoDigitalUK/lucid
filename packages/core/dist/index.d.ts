import { ConfigT } from "./db/models/Config";
export type { ConfigT as Config };
declare const _default: {
    start: () => Promise<void>;
    sendEmail: (template: string, params: import("./services/emails/send-email").EmailParamsT) => Promise<{
        success: boolean;
        message: string;
    }>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map