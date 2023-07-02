import z from "zod";
import fileUpload from "express-fileupload";
import { type MediaResT } from "../../services/media/format-media";
import mediaSchema from "../../schemas/media";
type MediaCreateSingle = (data: {
    location: string;
    name?: string;
    alt?: string;
    files: fileUpload.FileArray | null | undefined;
}) => Promise<MediaResT>;
type MediaGetMultiple = (query: z.infer<typeof mediaSchema.getMultiple.query>, data: {
    location: string;
}) => Promise<{
    data: MediaResT[];
    count: number;
}>;
type MediaGetSingle = (key: string, data: {
    location: string;
}) => Promise<MediaResT>;
type MediaDeleteSingle = (key: string, data: {
    location: string;
}) => Promise<MediaResT>;
type MediaUpdateSingle = (key: string, data: {
    location: string;
    name?: string;
    alt?: string;
    files: fileUpload.FileArray | null | undefined;
}) => Promise<MediaResT>;
export type MediaT = {
    id: number;
    key: string;
    e_tag: string;
    name: string;
    alt: string | null;
    mime_type: string;
    file_extension: string;
    file_size: number;
    width: number | null;
    height: number | null;
    created_at: string;
    updated_at: string;
};
export default class Media {
    #private;
    static createSingle: MediaCreateSingle;
    static getMultiple: MediaGetMultiple;
    static getSingle: MediaGetSingle;
    static deleteSingle: MediaDeleteSingle;
    static updateSingle: MediaUpdateSingle;
    static streamFile: (key: string) => Promise<import("@aws-sdk/client-s3").GetObjectCommandOutput>;
}
export {};
//# sourceMappingURL=Media.d.ts.map