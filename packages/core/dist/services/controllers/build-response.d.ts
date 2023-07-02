import { Request } from "express";
interface BuildResponseParams {
    data: Array<any> | {
        [key: string]: any;
    };
    pagination?: {
        count: number;
        page: string;
        per_page: string;
    };
}
type BuildResponseT = (req: Request, params: BuildResponseParams) => ResponseBody;
export declare const getLocation: (req: Request) => string;
declare const buildResponse: BuildResponseT;
export default buildResponse;
//# sourceMappingURL=build-response.d.ts.map