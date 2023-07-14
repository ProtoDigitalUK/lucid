export interface EmailParamsT {
    data: {
        [key: string]: any;
    };
    options?: {
        to: string;
        subject: string;
        from?: string;
        fromName?: string;
        cc?: string;
        bcc?: string;
        replyTo?: string;
    };
}
export interface MailOptionsT {
    to?: string;
    subject?: string;
    from?: string;
    fromName?: string;
    cc?: string;
    bcc?: string;
    replyTo?: string;
}
export declare const sendEmailExternal: (template: string, params: EmailParamsT) => Promise<{
    success: boolean;
    message: string;
}>;
export declare const sendEmailInternal: (template: string, params: EmailParamsT, id?: number, track?: boolean) => Promise<{
    success: boolean;
    message: string;
}>;
//# sourceMappingURL=send-email.d.ts.map