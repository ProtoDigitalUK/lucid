export interface ServiceData {
    id: number;
}
declare const resendSingle: (data: ServiceData) => Promise<{
    status: {
        success: boolean;
        message: string;
    };
    email: import("../../db/models/Email").EmailT;
}>;
export default resendSingle;
//# sourceMappingURL=resend-single.d.ts.map