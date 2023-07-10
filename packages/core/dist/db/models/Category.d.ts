import { SelectQueryBuilder } from "../../utils/app/query-helpers";
type CategoryGetSingle = (environment_key: string, id: number) => Promise<CategoryT>;
type CategoryGetMultiple = (query_instance: SelectQueryBuilder) => Promise<{
    data: CategoryT[];
    count: number;
}>;
type CategoryCreateSingle = (data: {
    environment_key: string;
    collection_key: string;
    title: string;
    slug: string;
    description?: string;
}) => Promise<CategoryT>;
type CategoryUpdateSingle = (environment_key: string, id: number, data: {
    title?: string;
    slug?: string;
    description?: string;
}) => Promise<CategoryT>;
type CategoryDeleteSingle = (environment_key: string, id: number) => Promise<CategoryT>;
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
    static createSingle: CategoryCreateSingle;
    static updateSingle: CategoryUpdateSingle;
    static deleteSingle: CategoryDeleteSingle;
    static isSlugUniqueInCollection: (data: {
        collection_key: string;
        slug: string;
        environment_key: string;
        ignore_id?: number;
    }) => Promise<boolean>;
}
export {};
//# sourceMappingURL=Category.d.ts.map