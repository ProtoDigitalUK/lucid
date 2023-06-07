import { Request } from "express";
import { CategoryT } from "../models/Category";
import BrickData, { BrickObject } from "../models/BrickData";
type PageGetMultiple = (req: Request) => Promise<{
    data: PageT[];
    count: number;
}>;
type PageGetSingle = (id: string, req: Request) => Promise<PageT>;
type PageCreate = (data: {
    title: string;
    slug: string;
    collection_key: string;
    homepage?: boolean;
    excerpt?: string;
    published?: boolean;
    parent_id?: number;
    category_ids?: Array<number>;
}, req: Request) => Promise<PageT>;
type PageUpdate = (id: string, data: {
    title?: string;
    slug?: string;
    homepage?: boolean;
    parent_id?: number;
    category_ids?: Array<number>;
    published?: boolean;
    excerpt?: string;
    bricks?: Array<BrickObject>;
}, req: Request) => Promise<PageT>;
export type PageT = {
    id: number;
    parent_id: number | null;
    collection_key: string;
    title: string;
    slug: string;
    full_slug: string;
    homepage: boolean;
    excerpt: string | null;
    categories?: Array<CategoryT> | null;
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
}
export {};
//# sourceMappingURL=Page.d.ts.map