declare const _default: {
    deleteSingle: (data: import("./delete-single").ServiceData) => Promise<never>;
    getMultiple: (data: import("./get-multiple").ServiceData) => Promise<{
        data: import("../../db/models/Email").EmailT[];
        count: number;
    }>;
    getSingle: (data: import("./get-single").ServiceData) => Promise<import("../../db/models/Email").EmailT>;
    resendSingle: (data: import("./resend-single").ServiceData) => Promise<{
        status: {
            success: boolean;
            message: string;
        };
        email: import("../../db/models/Email").EmailT;
    }>;
    createSingle: (data: import("./create-single").ServiceData) => Promise<import("../../db/models/Email").EmailT>;
    updateSingle: (data: import("./update-single").ServiceData) => Promise<import("../../db/models/Email").EmailT>;
    renderTemplate: (template: string, data: import("./render-template").renderTemplateDataT) => Promise<string>;
    sendEmailExternal: (template: string, params: import("./send-email").EmailParamsT) => Promise<{
        success: boolean;
        message: string;
    }>;
    sendEmailInternal: (template: string, params: import("./send-email").EmailParamsT, id?: number | undefined) => Promise<{
        success: boolean;
        message: string;
    }>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map