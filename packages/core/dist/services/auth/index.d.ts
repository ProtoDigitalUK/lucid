/// <reference types="express" />
/// <reference types="qs" />
declare const _default: {
    csrf: {
        generateCSRFToken: (res: import("express").Response<any, Record<string, any>>) => string;
        verifyCSRFToken: (req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>) => boolean;
        clearCSRFToken: (res: import("express").Response<any, Record<string, any>>) => void;
    };
    jwt: {
        generateJWT: (res: import("express").Response<any, Record<string, any>>, user: import("../../db/models/User").UserT) => void;
        verifyJWT: (req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>) => {
            sucess: boolean;
            data: null;
        } | {
            sucess: boolean;
            data: {
                id: number;
                email: string;
                username: string;
            };
        };
        clearJWT: (res: import("express").Response<any, Record<string, any>>) => void;
    };
    login: (data: import("./login").ServiceData) => Promise<import("../../utils/format/format-user").UserResT>;
    validatePassword: (data: import("./validate-password").ServiceData) => Promise<boolean>;
    sendResetPassword: (data: import("./send-reset-password").ServiceData) => Promise<{
        message: string;
    }>;
    verifyResetPassword: (data: import("./verify-reset-password").ServiceData) => Promise<{}>;
    resetPassword: (data: import("./reset-password").ServiceData) => Promise<{
        message: string;
    }>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map