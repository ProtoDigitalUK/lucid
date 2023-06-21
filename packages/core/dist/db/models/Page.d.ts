import z from "zod";
import BrickData, { BrickObject } from "../models/BrickData";
import pagesSchema from "../../schemas/pages";
type PageGetMultiple = (environment_key: string, query: z.infer<typeof pagesSchema.getMultiple.query>) => Promise<{
    data: PageT[];
    count: number;
}>;
type PageGetSingle = (environment_key: string, id: string, query: z.infer<typeof pagesSchema.getSingle.query>) => Promise<PageT>;
type PageCreate = (userId: number, data: {
    environment_key: string;
    title: string;
    slug: string;
    collection_key: string;
    homepage?: boolean;
    excerpt?: string;
    published?: boolean;
    parent_id?: number;
    category_ids?: Array<number>;
}) => Promise<PageT>;
type PageUpdate = (userId: number, environment_key: string, id: string, data: {
    title?: string;
    slug?: string;
    homepage?: boolean;
    parent_id?: number;
    category_ids?: Array<number>;
    published?: boolean;
    excerpt?: string;
    bricks?: Array<BrickObject>;
}) => Promise<PageT>;
type PageDelete = (environment_key: string, id: string) => Promise<PageT>;
export type PageT = {
    id: number;
    environment_key: string;
    parent_id: number | null;
    collection_key: string;
    title: string;
    slug: string;
    full_slug: string;
    homepage: boolean;
    excerpt: string | null;
    categories?: Array<number> | null;
    bricks?: Array<BrickData> | null;
    published: boolean;
    published_at: string | null;
    published_by: number | null;
    created_by: number | null;
    created_at: string;
    updated_at: string;
};
export default class Page {
    #private;
    static getMultiple: PageGetMultiple;
    static getSingle: PageGetSingle;
    static create: PageCreate;
    static update: PageUpdate;
    static delete: PageDelete;
}
export {};
//# sourceMappingURL=Page.d.ts.map