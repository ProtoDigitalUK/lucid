/// <reference types="node" resolution-mode="require"/>
import z from "zod";
import { PoolClient } from "pg";
import { Readable } from "stream";
import mediaSchema from "../../schemas/media.js";
export interface ServiceData {
    key: string;
    processKey: string;
    options: z.infer<typeof mediaSchema.streamSingle.query>;
}
export interface Response {
    contentLength?: number;
    contentType?: string;
    body: Readable;
}
declare const processImage: (client: PoolClient, data: ServiceData) => Promise<Response>;
export default processImage;
//# sourceMappingURL=process-image.d.ts.map