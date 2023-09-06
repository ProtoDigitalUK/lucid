/// <reference types="node" />
import z from "zod";
import { Readable } from "stream";
import mediaSchema from "../../schemas/media.js";
export interface ServiceData {
    key: string;
    query: z.infer<typeof mediaSchema.streamSingle.query>;
}
export interface ResponseT {
    contentLength?: number;
    contentType?: string;
    body?: Readable;
}
declare const streamMedia: (data: ServiceData) => Promise<ResponseT | undefined>;
export default streamMedia;
//# sourceMappingURL=stream-media.d.ts.map