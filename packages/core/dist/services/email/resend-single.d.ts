export interface ServiceData {
    id: number;
}
declare const resendSingle: (data: ServiceData) => Promise<{
    email: import("../../db/models/Email").EmailT;
    status: {
        success: boolean;
        message: string;
    };
}>;
export default resendSingle;
//# sourceMappingURL=resend-single.d.ts.map