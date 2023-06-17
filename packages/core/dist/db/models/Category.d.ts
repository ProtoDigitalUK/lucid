import { Request } from "express";
type CategoryGetSingle = (id: number, req: Request) => Promise<CategoryT>;
type CategoryGetMultiple = (req: Request) => Promise<{
    data: CategoryT[];
    count: number;
}>;
type CategoryCreate = (data: {
    collection_key: string;
    title: string;
    slug: string;
    description?: string;
}, req: Request) => Promise<CategoryT>;
type CategoryUpdate = (id: number, data: {
    title?: string;
    slug?: string;
    description?: string;
}, req: Request) => Promise<CategoryT>;
type CategoryDelete = (id: number, req: Request) => Promise<CategoryT>;
export type CategoryT = {
    id: number;
    environment_key: string;
    collection_key: string;
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
    static isSlugUniqueInCollection: (data: {
        collection_key: string;
        slug: string;
        environment_key: string;
        ignore_id?: number;
    }) => Promise<boolean>;
}
export {};
//# sourceMappingURL=Category.d.ts.map