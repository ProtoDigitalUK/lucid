declare const _default: {
    deleteSingle: (data: import("./delete-single").ServiceData) => Promise<import("../../db/models/Email").EmailT>;
    getMultiple: (data: import("./get-multiple").ServiceData) => Promise<{
        data: import("../../db/models/Email").EmailT[];
        count: number;
    }>;
    getSingle: (data: import("./get-single").ServiceData) => Promise<import("../../db/models/Email").EmailT>;
    resendSingle: (data: import("./resend-single").ServiceData) => Promise<{
        email: import("../../db/models/Email").EmailT;
        status: {
            success: boolean;
            message: string;
        };
    }>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map