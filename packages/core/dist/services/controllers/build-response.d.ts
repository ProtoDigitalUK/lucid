import { Request } from "express";
type BuildResponseT = (req: Request, props: {
    data: Array<any> | {
        [key: string]: any;
    };
}) => ResponseBody;
declare const buildResponse: BuildResponseT;
export default buildResponse;
//# sourceMappingURL=build-response.d.ts.map