export interface MediaResT {
    id: number;
    key: string;
    url: string;
    name: string;
    alt: string | null;
    meta: {
        mime_type: string;
        file_extension: string;
        file_size: number;
        width: number | null;
        height: number | null;
    };
    created_at: string;
    updated_at: string;
}
declare const _default: {
    createSingle: (data: import("./create-single").ServiceData) => Promise<MediaResT>;
    deleteSingle: (data: import("./delete-single").ServiceData) => Promise<MediaResT>;
    getMultiple: (data: import("./get-multiple").ServiceData) => Promise<{
        data: MediaResT[];
        count: number;
    }>;
    getSingle: (data: import("./get-single").ServiceData) => Promise<MediaResT>;
    updateSingle: (data: import("./update-single").ServiceData) => Promise<MediaResT>;
    streamMedia: (data: import("./stream-media").ServiceData) => Promise<import("@aws-sdk/client-s3").GetObjectCommandOutput>;
    canStoreFiles: (data: import("./can-store-files").ServiceData) => Promise<void>;
    getStorageUsed: () => Promise<number>;
    setStorageUsed: (data: import("./set-storage-used").ServiceData) => Promise<number>;
    format: (media: import("../../db/models/Media").MediaT) => MediaResT;
    getSingleById: (data: import("./get-single-by-id").ServiceData) => Promise<MediaResT>;
    getMultipleByIds: (data: import("./get-multiple-by-ids").ServiceData) => Promise<MediaResT[]>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map