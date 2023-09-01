/// <reference types="node" />
import { PoolClient } from "pg";
import z from "zod";
import { Readable } from "stream";
import mediaSchema from "../../schemas/media";
export interface ServiceData {
    key: string;
    query: z.infer<typeof mediaSchema.streamSingle.query>;
}
export interface Response {
    contentLength?: number;
    contentType?: string;
    body: Readable;
}
declare const processImage: (client: PoolClient, data: ServiceData) => Promise<Response>;
export default processImage;
//# sourceMappingURL=process-image.d.ts.map