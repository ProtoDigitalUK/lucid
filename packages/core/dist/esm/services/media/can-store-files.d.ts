import { PoolClient } from "pg";
import fileUpload from "express-fileupload";
export interface ServiceData {
    files: fileUpload.UploadedFile[];
}
declare const canStoreFiles: (client: PoolClient, data: ServiceData) => Promise<void>;
export default canStoreFiles;
//# sourceMappingURL=can-store-files.d.ts.map