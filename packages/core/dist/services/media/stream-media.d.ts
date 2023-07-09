export interface ServiceData {
    key: string;
}
declare const streamMedia: (data: ServiceData) => Promise<import("@aws-sdk/client-s3").GetObjectCommandOutput>;
export default streamMedia;
//# sourceMappingURL=stream-media.d.ts.map