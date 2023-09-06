declare const _default: {
    deleteSingle: (client: import("pg").PoolClient, data: import("./delete-single.js").ServiceData) => Promise<never>;
    getMultiple: (client: import("pg").PoolClient, data: import("./get-multiple.js").ServiceData) => Promise<{
        data: import("../../db/models/Email.js").EmailT[];
        count: number;
    }>;
    getSingle: (client: import("pg").PoolClient, data: import("./get-single.js").ServiceData) => Promise<import("../../db/models/Email.js").EmailT>;
    resendSingle: (client: import("pg").PoolClient, data: import("./resend-single.js").ServiceData) => Promise<{
        status: {
            success: boolean;
            message: string;
        };
        email: import("../../db/models/Email.js").EmailT;
    }>;
    createSingle: (client: import("pg").PoolClient, data: import("./create-single.js").ServiceData) => Promise<import("../../db/models/Email.js").EmailT>;
    updateSingle: (client: import("pg").PoolClient, data: import("./update-single.js").ServiceData) => Promise<import("../../db/models/Email.js").EmailT>;
    renderTemplate: (template: string, data: import("./render-template.js").renderTemplateDataT) => Promise<string>;
    sendEmailExternal: (template: string, params: import("./send-email.js").EmailParamsT, track?: boolean | undefined) => Promise<{
        success: boolean;
        message: string;
    }>;
    sendEmailInternal: (client: import("pg").PoolClient, data: {
        template: string;
        params: import("./send-email.js").EmailParamsT;
        id?: number | undefined;
        track?: boolean | undefined;
    }) => Promise<{
        success: boolean;
        message: string;
    }>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map