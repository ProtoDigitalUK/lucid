import { PoolClient } from "pg";
import { SelectQueryBuilder } from "../../utils/app/query-helpers.js";
type CategoryGetSingle = (client: PoolClient, data: {
    environment_key: string;
    id: number;
}) => Promise<CategoryT>;
type CategoryGetMultiple = (client: PoolClient, query_instance: SelectQueryBuilder) => Promise<{
    data: CategoryT[];
    count: number;
}>;
type CategoryCreateSingle = (client: PoolClient, data: {
    environment_key: string;
    collection_key: string;
    title: string;
    slug: string;
    description?: string;
}) => Promise<CategoryT>;
type CategoryUpdateSingle = (client: PoolClient, data: {
    environment_key: string;
    id: number;
    title?: string;
    slug?: string;
    description?: string;
}) => Promise<CategoryT>;
type CategoryDeleteSingle = (client: PoolClient, data: {
    environment_key: string;
    id: number;
}) => Promise<CategoryT>;
type CategoryIsSlugUniqueInCollection = (client: PoolClient, data: {
    collection_key: string;
    slug: string;
    environment_key: string;
    ignore_id?: number;
}) => Promise<boolean>;
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
    static isSlugUniqueInCollection: CategoryIsSlugUniqueInCollection;
}
export {};
//# sourceMappingURL=Category.d.ts.map