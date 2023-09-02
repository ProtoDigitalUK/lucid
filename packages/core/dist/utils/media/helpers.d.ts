/// <reference types="node" />
import fileUpload from "express-fileupload";
import z from "zod";
import { Readable } from "stream";
import mediaSchema from "../../schemas/media";
export interface MediaMetaDataT {
    mimeType: string;
    fileExtension: string;
    size: number;
    width: number | null;
    height: number | null;
}
export interface CreateProcessKeyT {
    key: string;
    query: z.infer<typeof mediaSchema.streamSingle.query>;
}
declare const helpers: {
    uniqueKey: (name: string) => string;
    getMetaData: (file: fileUpload.UploadedFile) => Promise<MediaMetaDataT>;
    formatReqFiles: (files: fileUpload.FileArray) => fileUpload.UploadedFile[];
    createProcessKey: (data: CreateProcessKeyT) => string;
    streamToBuffer: (readable: Readable) => Promise<Buffer>;
};
export default helpers;
//# sourceMappingURL=helpers.d.ts.map