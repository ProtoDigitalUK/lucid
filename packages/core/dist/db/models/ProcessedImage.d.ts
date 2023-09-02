import { PoolClient } from "pg";
type ProcessImageCreateSingle = (client: PoolClient, data: {
    key: string;
    media_key: string;
}) => Promise<ProcessedImageT>;
type ProcessImageGetAllByMediaKey = (client: PoolClient, data: {
    media_key: string;
}) => Promise<ProcessedImageT[]>;
type ProcessImageDeleteAllByMediaKey = (client: PoolClient, data: {
    media_key: string;
}) => Promise<ProcessedImageT[]>;
export type ProcessedImageT = {
    key: string;
    media_key: string;
};
export default class ProcessedImage {
    static createSingle: ProcessImageCreateSingle;
    static getAllByMediaKey: ProcessImageGetAllByMediaKey;
    static deleteAllByMediaKey: ProcessImageDeleteAllByMediaKey;
    static getAll: (client: PoolClient) => Promise<ProcessedImageT[]>;
    static deleteAll: (client: PoolClient) => Promise<ProcessedImageT[]>;
}
export {};
//# sourceMappingURL=ProcessedImage.d.ts.map