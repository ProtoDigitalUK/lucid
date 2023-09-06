export interface ServiceData {
    objects: Array<{
        key: string;
    }>;
}
declare const deleteObjects: (data: ServiceData) => Promise<import("@aws-sdk/client-s3").DeleteObjectsCommandOutput>;
export default deleteObjects;
//# sourceMappingURL=delete-objects.d.ts.map