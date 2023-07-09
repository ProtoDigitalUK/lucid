/// <reference types="express" />
/// <reference types="qs" />
declare const _default: {
    csrf: {
        generateCSRFToken: (res: import("express").Response<any, Record<string, any>>) => string;
        verifyCSRFToken: (req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>) => boolean;
        clearCSRFToken: (res: import("express").Response<any, Record<string, any>>) => void;
    };
    getAuthenticatedUser: (data: import("./get-authenticated-user").ServiceData) => Promise<import("../../db/models/User").UserT>;
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
    login: (data: import("./login").ServiceData) => Promise<import("../../db/models/User").UserT>;
    registerSuperAdmin: (data: import("./register-superadmin").ServiceData) => Promise<import("../../db/models/User").UserT>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map