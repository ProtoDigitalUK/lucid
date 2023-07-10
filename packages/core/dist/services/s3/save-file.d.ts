import fileUpload from "express-fileupload";
import { type MediaMetaDataT } from "../../utils/media/helpers";
export interface ServiceData {
    key: string;
    file: fileUpload.UploadedFile;
    meta: MediaMetaDataT;
}
declare const saveFile: (data: ServiceData) => Promise<import("@aws-sdk/client-s3").PutObjectCommandOutput>;
export default saveFile;
//# sourceMappingURL=save-file.d.ts.map