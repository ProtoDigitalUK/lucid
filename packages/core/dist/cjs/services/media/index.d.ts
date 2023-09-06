declare const _default: {
    createSingle: (client: import("pg").PoolClient, data: import("./create-single.js").ServiceData) => Promise<import("@lucid/types/src/media.js").MediaResT>;
    deleteSingle: (client: import("pg").PoolClient, data: import("./delete-single.js").ServiceData) => Promise<undefined>;
    getMultiple: (client: import("pg").PoolClient, data: import("./get-multiple.js").ServiceData) => Promise<{
        data: import("@lucid/types/src/media.js").MediaResT[];
        count: number;
    }>;
    getSingle: (client: import("pg").PoolClient, data: import("./get-single.js").ServiceData) => Promise<import("@lucid/types/src/media.js").MediaResT>;
    updateSingle: (client: import("pg").PoolClient, data: import("./update-single.js").ServiceData) => Promise<undefined>;
    streamMedia: (data: import("./stream-media.js").ServiceData) => Promise<import("./stream-media.js").ResponseT | undefined>;
    canStoreFiles: (client: import("pg").PoolClient, data: import("./can-store-files.js").ServiceData) => Promise<void>;
    getStorageUsed: (client: import("pg").PoolClient) => Promise<number | undefined>;
    setStorageUsed: (client: import("pg").PoolClient, data: import("./set-storage-used.js").ServiceData) => Promise<number | undefined>;
    getSingleById: (client: import("pg").PoolClient, data: import("./get-single-by-id.js").ServiceData) => Promise<import("@lucid/types/src/media.js").MediaResT>;
    getMultipleByIds: (client: import("pg").PoolClient, data: import("./get-multiple-by-ids.js").ServiceData) => Promise<import("@lucid/types/src/media.js").MediaResT[]>;
    streamErrorImage: (data: import("./stream-error-image.js").ServiceData) => Promise<void>;
    getS3Object: (data: import("./get-s3-object.js").ServiceData) => Promise<import("./get-s3-object.js").Response>;
    pipeRemoteURL: (data: import("./pipe-remote-url.js").ServiceData) => Promise<import("./pipe-remote-url.js").PipeRemoteURLResponse>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map