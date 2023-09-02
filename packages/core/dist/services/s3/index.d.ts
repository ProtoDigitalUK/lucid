declare const _default: {
    saveObject: (data: import("./save-object").ServiceData) => Promise<import("@aws-sdk/client-s3").PutObjectCommandOutput>;
    deleteObject: (data: import("./delete-object").ServiceData) => Promise<import("@aws-sdk/client-s3").DeleteObjectCommandOutput>;
    deleteObjects: (data: import("./delete-objects").ServiceData) => Promise<import("@aws-sdk/client-s3").DeleteObjectsCommandOutput>;
    updateObjectKey: (data: import("./update-object-key").ServiceData) => Promise<import("@aws-sdk/client-s3").CopyObjectCommandOutput>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map