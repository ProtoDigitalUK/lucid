/// <reference types="node" resolution-mode="require"/>
import { Readable } from "stream";
export interface ServiceData {
    key: string;
}
export interface Response {
    contentLength?: number;
    contentType?: string;
    body: Readable;
}
declare const getS3Object: (data: ServiceData) => Promise<Response>;
export default getS3Object;
//# sourceMappingURL=get-s3-object.d.ts.map