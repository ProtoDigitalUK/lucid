export interface ServiceData {
    key: string;
}
declare const deleteObject: (data: ServiceData) => Promise<import("@aws-sdk/client-s3").DeleteObjectCommandOutput>;
export default deleteObject;
//# sourceMappingURL=delete-object.d.ts.map