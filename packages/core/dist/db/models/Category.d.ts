import { Request } from "express";
type CategoryGetSingle = (id: number) => Promise<CategoryT>;
type CategoryGetMultiple = (req: Request) => Promise<{
    data: CategoryT[];
    count: number;
}>;
type CategoryCreate = (data: {
    post_type_id: number;
    title: string;
    slug: string;
    description?: string;
}) => Promise<CategoryT>;
type CategoryUpdate = (id: number, data: {
    title?: string;
    slug?: string;
    description?: string;
}) => Promise<CategoryT>;
type CategoryDelete = (id: number) => Promise<CategoryT>;
export type CategoryT = {
    id: number;
    post_type_id: number;
    title: string;
    slug: string;
    description: string | null;
    created_at: string;
    updated_at: string;
};
export default class Category {
    static getMultiple: CategoryGetMultiple;
    static getSingle: CategoryGetSingle;
    static create: CategoryCreate;
    static update: CategoryUpdate;
    static delete: CategoryDelete;
    static isSlugUniqueInPostType: (post_type_id: number, slug: string, ignore_id?: number) => Promise<boolean>;
}
export {};
//# sourceMappingURL=Category.d.ts.map