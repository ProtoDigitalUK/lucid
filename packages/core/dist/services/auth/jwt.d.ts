import { Response, Request } from "express";
import { UserT } from "../../db/models/User";
export declare const generateJWT: (res: Response, user: UserT) => void;
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
//# sourceMappingURL=jwt.d.ts.map