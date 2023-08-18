import { Response, Request } from "express";
import { UserResT } from "@lucid/types/src/users";
export declare const generateJWT: (res: Response, user: UserResT) => void;
export declare const verifyJWT: (req: Request) => {
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
export declare const clearJWT: (res: Response) => void;
declare const _default: {
    generateJWT: (res: Response<any, Record<string, any>>, user: UserResT) => void;
    verifyJWT: (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>) => {
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
    clearJWT: (res: Response<any, Record<string, any>>) => void;
};
export default _default;
//# sourceMappingURL=jwt.d.ts.map