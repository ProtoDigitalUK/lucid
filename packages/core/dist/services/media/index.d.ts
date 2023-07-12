declare const _default: {
    createSingle: (data: import("./create-single").ServiceData) => Promise<import("../../utils/format/format-media").MediaResT>;
    deleteSingle: (data: import("./delete-single").ServiceData) => Promise<import("../../utils/format/format-media").MediaResT>;
    getMultiple: (data: import("./get-multiple").ServiceData) => Promise<{
        data: import("../../utils/format/format-media").MediaResT[];
        count: number;
    }>;
    getSingle: (data: import("./get-single").ServiceData) => Promise<import("../../utils/format/format-media").MediaResT>;
    updateSingle: (data: import("./update-single").ServiceData) => Promise<import("../../utils/format/format-media").MediaResT>;
    streamMedia: (data: import("./stream-media").ServiceData) => Promise<import("@aws-sdk/client-s3").GetObjectCommandOutput>;
    canStoreFiles: (data: import("./can-store-files").ServiceData) => Promise<void>;
    getStorageUsed: () => Promise<number>;
    setStorageUsed: (data: import("./set-storage-used").ServiceData) => Promise<number>;
    getSingleById: (data: import("./get-single-by-id").ServiceData) => Promise<import("../../utils/format/format-media").MediaResT>;
    getMultipleByIds: (data: import("./get-multiple-by-ids").ServiceData) => Promise<import("../../utils/format/format-media").MediaResT[]>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map