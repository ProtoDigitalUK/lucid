declare const _default: {
    deleteSingle: (client: import("pg").PoolClient, data: import("./delete-single").ServiceData) => Promise<never>;
    getMultiple: (client: import("pg").PoolClient, data: import("./get-multiple").ServiceData) => Promise<{
        data: import("../../db/models/Email").EmailT[];
        count: number;
    }>;
    getSingle: (client: import("pg").PoolClient, data: import("./get-single").ServiceData) => Promise<import("../../db/models/Email").EmailT>;
    resendSingle: (client: import("pg").PoolClient, data: import("./resend-single").ServiceData) => Promise<{
        status: {
            success: boolean;
            message: string;
        };
        email: import("../../db/models/Email").EmailT;
    }>;
    createSingle: (client: import("pg").PoolClient, data: import("./create-single").ServiceData) => Promise<import("../../db/models/Email").EmailT>;
    updateSingle: (client: import("pg").PoolClient, data: import("./update-single").ServiceData) => Promise<import("../../db/models/Email").EmailT>;
    renderTemplate: (template: string, data: import("./render-template").renderTemplateDataT) => Promise<string>;
    sendEmailExternal: (template: string, params: import("./send-email").EmailParamsT, track?: boolean | undefined) => Promise<{
        success: boolean;
        message: string;
    }>;
    sendEmailInternal: (client: import("pg").PoolClient, data: {
        template: string;
        params: import("./send-email").EmailParamsT;
        id?: number | undefined;
        track?: boolean | undefined;
    }) => Promise<{
        success: boolean;
        message: string;
    }>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map