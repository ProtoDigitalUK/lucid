declare const _default: {
    createSingle: (client: import("pg").PoolClient, data: import("./create-single").ServiceData) => Promise<import("../../utils/format/format-media").MediaResT>;
    deleteSingle: (client: import("pg").PoolClient, data: import("./delete-single").ServiceData) => Promise<import("../../utils/format/format-media").MediaResT>;
    getMultiple: (client: import("pg").PoolClient, data: import("./get-multiple").ServiceData) => Promise<{
        data: import("../../utils/format/format-media").MediaResT[];
        count: number;
    }>;
    getSingle: (client: import("pg").PoolClient, data: import("./get-single").ServiceData) => Promise<import("../../utils/format/format-media").MediaResT>;
    updateSingle: (client: import("pg").PoolClient, data: import("./update-single").ServiceData) => Promise<import("../../utils/format/format-media").MediaResT>;
    streamMedia: (data: import("./stream-media").ServiceData) => Promise<import("@aws-sdk/client-s3").GetObjectCommandOutput>;
    canStoreFiles: (client: import("pg").PoolClient, data: import("./can-store-files").ServiceData) => Promise<void>;
    getStorageUsed: (client: import("pg").PoolClient) => Promise<number>;
    setStorageUsed: (client: import("pg").PoolClient, data: import("./set-storage-used").ServiceData) => Promise<number>;
    getSingleById: (client: import("pg").PoolClient, data: import("./get-single-by-id").ServiceData) => Promise<import("../../utils/format/format-media").MediaResT>;
    getMultipleByIds: (client: import("pg").PoolClient, data: import("./get-multiple-by-ids").ServiceData) => Promise<import("../../utils/format/format-media").MediaResT[]>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map