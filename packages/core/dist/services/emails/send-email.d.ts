interface EmailParamsT {
    data: {
        [key: string]: any;
    };
    options?: {
        to: string;
        subject: string;
        from?: string;
        cc?: string;
        bcc?: string;
        replyTo?: string;
    };
}
declare const sendEmail: (template: string, params: EmailParamsT) => Promise<{
    success: boolean;
    message: string;
}>;
export default sendEmail;
//# sourceMappingURL=send-email.d.ts.map