import { z } from "zod";
import categorySchema from "../../schemas/categories";
type CategoryGetSingle = (environment_key: string, id: number) => Promise<CategoryT>;
type CategoryGetMultiple = (environment_key: string, query: z.infer<typeof categorySchema.getMultiple.query>) => Promise<{
    data: CategoryT[];
    count: number;
}>;
type CategoryCreate = (data: {
    environment_key: string;
    collection_key: string;
    title: string;
    slug: string;
    description?: string;
}) => Promise<CategoryT>;
type CategoryUpdate = (environment_key: string, id: number, data: {
    title?: string;
    slug?: string;
    description?: string;
}) => Promise<CategoryT>;
type CategoryDelete = (environment_key: string, id: number) => Promise<CategoryT>;
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