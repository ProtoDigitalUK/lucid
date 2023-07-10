export interface ServiceData {
    key: string;
}
declare const deleteFile: (data: ServiceData) => Promise<import("@aws-sdk/client-s3").DeleteObjectCommandOutput>;
export default deleteFile;
//# sourceMappingURL=delete-file.d.ts.map