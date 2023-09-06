/// <reference types="node" resolution-mode="require"/>
import z from "zod";
import mediaSchema from "../schemas/media.js";
interface WorkerData {
    buffer: Buffer;
    options: z.infer<typeof mediaSchema.streamSingle.query>;
}
export interface ProcessImageSuccessRes {
    success: true;
    data: {
        buffer: Buffer;
        mimeType: string;
        size: number;
        width: number | null;
        height: number | null;
        extension: string;
    };
}
declare const useProcessImage: (data: WorkerData) => Promise<ProcessImageSuccessRes["data"]>;
export default useProcessImage;
//# sourceMappingURL=process-image.d.ts.map