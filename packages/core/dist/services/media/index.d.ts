declare const _default: {
    createSingle: (client: import("pg").PoolClient, data: import("./create-single").ServiceData) => Promise<import("@lucid/types/src/media").MediaResT>;
    deleteSingle: (client: import("pg").PoolClient, data: import("./delete-single").ServiceData) => Promise<import("@lucid/types/src/media").MediaResT>;
    getMultiple: (client: import("pg").PoolClient, data: import("./get-multiple").ServiceData) => Promise<{
        data: import("@lucid/types/src/media").MediaResT[];
        count: number;
    }>;
    getSingle: (client: import("pg").PoolClient, data: import("./get-single").ServiceData) => Promise<import("@lucid/types/src/media").MediaResT>;
    updateSingle: (client: import("pg").PoolClient, data: import("./update-single").ServiceData) => Promise<import("@lucid/types/src/media").MediaResT>;
    streamMedia: (data: import("./stream-media").ServiceData) => Promise<import("./stream-media").ResponseT | undefined>;
    canStoreFiles: (client: import("pg").PoolClient, data: import("./can-store-files").ServiceData) => Promise<void>;
    getStorageUsed: (client: import("pg").PoolClient) => Promise<number | undefined>;
    setStorageUsed: (client: import("pg").PoolClient, data: import("./set-storage-used").ServiceData) => Promise<number | undefined>;
    getSingleById: (client: import("pg").PoolClient, data: import("./get-single-by-id").ServiceData) => Promise<import("@lucid/types/src/media").MediaResT>;
    getMultipleByIds: (client: import("pg").PoolClient, data: import("./get-multiple-by-ids").ServiceData) => Promise<import("@lucid/types/src/media").MediaResT[]>;
    streamErrorImage: (data: import("./steam-error-image").ServiceData) => Promise<void>;
    processImage: (client: import("pg").PoolClient, data: import("./process-image").ServiceData) => Promise<import("./process-image").Response>;
    getS3Object: (data: import("./get-s3-object").ServiceData) => Promise<import("./get-s3-object").Response>;
    pipeRemoteURL: (data: import("./pipe-remote-url").ServiceData) => void;
};
export default _default;
//# sourceMappingURL=index.d.ts.map