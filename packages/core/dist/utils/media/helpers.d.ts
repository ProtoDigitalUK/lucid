import fileUpload from "express-fileupload";
export interface MediaMetaDataT {
    mimeType: string;
    fileExtension: string;
    size: number;
    width: number | null;
    height: number | null;
}
declare const helpers: {
    uniqueKey: (name: string) => string;
    getMetaData: (file: fileUpload.UploadedFile) => Promise<MediaMetaDataT>;
    formatReqFiles: (files: fileUpload.FileArray) => fileUpload.UploadedFile[];
};
export default helpers;
//# sourceMappingURL=helpers.d.ts.map