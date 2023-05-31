import { Request } from "express";
import { CategoryT } from "../models/Category";
type PageGetMultiple = (req: Request) => Promise<{
    data: PageT[];
    count: number;
}>;
type PageCreate = (req: Request, data: {
    title: string;
    slug: string;
    post_type_id: number;
    homepage?: boolean;
    excerpt?: string;
    published?: boolean;
    parent_id?: number;
    category_ids?: Array<number>;
}) => Promise<PageT>;
export type PageT = {
    id: number;
    post_type_id: number;
    parent_id: number | null;
    title: string;
    slug: string;
    full_slug: string;
    homepage: boolean;
    excerpt: string | null;
    categories?: Array<CategoryT>;
    published: boolean;
    published_at: string | null;
    published_by: number | null;
    created_by: number | null;
    created_at: string;
    updated_at: string;
};
export default class Page {
    static getMultiple: PageGetMultiple;
    static create: PageCreate;
    static slugUnique: (slug: string, parent_id: number | null) => Promise<string>;
    static checkParentNotHomepage: (parent_id: number | null) => Promise<void>;
    static checkParentIsSameType: (parent_id: number, post_type_id: number) => Promise<void>;
    static resetHomepages: (current: number) => Promise<void>;
    static computeFullSlug: (slug: string, parent_id: number | null, homepage: boolean) => Promise<string>;
}
export {};
//# sourceMappingURL=Page.d.ts.map