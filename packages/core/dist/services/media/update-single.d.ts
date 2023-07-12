import fileUpload from "express-fileupload";
export interface ServiceData {
    key: string;
    data: {
        name?: string;
        alt?: string;
        files: fileUpload.FileArray | null | undefined;
    };
}
declare const updateSingle: (data: ServiceData) => Promise<import("../../utils/format/format-media").MediaResT>;
export default updateSingle;
//# sourceMappingURL=update-single.d.ts.map