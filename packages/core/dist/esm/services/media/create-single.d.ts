import { PoolClient } from "pg";
import fileUpload from "express-fileupload";
export interface ServiceData {
    name?: string;
    alt?: string;
    files?: fileUpload.FileArray | null | undefined;
}
declare const createSingle: (client: PoolClient, data: ServiceData) => Promise<import("@lucid/types/src/media.js").MediaResT>;
export default createSingle;
//# sourceMappingURL=create-single.d.ts.map