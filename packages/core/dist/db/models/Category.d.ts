import { Request } from "express";
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
    static create: CategoryCreate;
    static isSlugUniqueInPostType: (post_type_id: number, slug: string) => Promise<boolean>;
}
export {};
//# sourceMappingURL=Category.d.ts.map