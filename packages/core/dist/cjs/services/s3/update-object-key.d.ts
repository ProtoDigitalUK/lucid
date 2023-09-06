export interface ServiceData {
    newKey: string;
    oldKey: string;
}
declare const updateObjectKey: (data: ServiceData) => Promise<import("@aws-sdk/client-s3").CopyObjectCommandOutput>;
export default updateObjectKey;
//# sourceMappingURL=update-object-key.d.ts.map