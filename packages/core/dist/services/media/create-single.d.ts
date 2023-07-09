import fileUpload from "express-fileupload";
export interface ServiceData {
    name?: string;
    alt?: string;
    files?: fileUpload.FileArray | null | undefined;
}
declare const createSingle: (data: ServiceData) => Promise<import("../../utils/media/format-media").MediaResT>;
export default createSingle;
//# sourceMappingURL=create-single.d.ts.map