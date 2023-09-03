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
type ProcessImageGetAllByMediaKeyCount = (client: PoolClient, data: {
    media_key: string;
}) => Promise<number>;
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
    static getAllByMediaKeyCount: ProcessImageGetAllByMediaKeyCount;
}
export {};
//# sourceMappingURL=ProcessedImage.d.ts.map