import { Response } from "express";
export interface ServiceData {
    url: string;
    res: Response;
    redirections?: number;
}
declare const pipeRemoteURL: (data: ServiceData) => void;
export default pipeRemoteURL;
//# sourceMappingURL=pipe-remote-url.d.ts.map