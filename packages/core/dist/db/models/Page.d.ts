import z from "zod";
import { BrickObject } from "../models/CollectionBrick";
import { BrickResT } from "../../utils/format/format-bricks";
import pagesSchema from "../../schemas/pages";
type PageGetMultiple = (query: z.infer<typeof pagesSchema.getMultiple.query>, data: {
    environment_key: string;
}) => Promise<{
    data: PageT[];
    count: number;
}>;
type PageGetSingle = (query: z.infer<typeof pagesSchema.getSingle.query>, data: {
    environment_key: string;
    id: number;
}) => Promise<PageT>;
type PageGetSingleBasic = (id: number, environment_key: string) => Promise<PageT>;
type PageGetSlugCount = (data: {
    slug: string;
    environment_key: string;
    collection_key: string;
    parent_id?: number;
}) => Promise<number>;
type PageCreateSingle = (data: {
    userId: number;
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
type PageUpdateSingle = (data: {
    id: number;
    environment_key: string;
    userId: number;
    title?: string;
    slug?: string;
    homepage?: boolean;
    parent_id?: number;
    category_ids?: Array<number>;
    published?: boolean;
    excerpt?: string;
    builder_bricks?: Array<BrickObject>;
    fixed_bricks?: Array<BrickObject>;
}) => Promise<PageT>;
type PageDeleteSingle = (data: {
    environment_key: string;
    id: number;
}) => Promise<PageT>;
type PageGetMultipleByIds = (data: {
    ids: Array<number>;
    environment_key: string;
}) => Promise<PageT[]>;
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
    builder_bricks?: Array<BrickResT> | null;
    fixed_bricks?: Array<BrickResT> | null;
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
    static createSingle: PageCreateSingle;
    static updateSingle: PageUpdateSingle;
    static deleteSingle: PageDeleteSingle;
    static getMultipleByIds: PageGetMultipleByIds;
    static getSingleBasic: PageGetSingleBasic;
    static getSlugCount: PageGetSlugCount;
}
export {};
//# sourceMappingURL=Page.d.ts.map