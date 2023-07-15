import { PoolClient } from "pg";
import { BrickObject } from "../models/CollectionBrick";
import { SelectQueryBuilder } from "../../utils/app/query-helpers";
import { BrickResT } from "../../utils/format/format-bricks";
type PageGetMultiple = (client: PoolClient, query_instance: SelectQueryBuilder) => Promise<{
    data: PageT[];
    count: number;
}>;
type PageGetSingle = (client: PoolClient, query_instance: SelectQueryBuilder) => Promise<PageT>;
type PageGetSingleBasic = (client: PoolClient, data: {
    id: number;
    environment_key: string;
}) => Promise<PageT>;
type PageGetSlugCount = (client: PoolClient, data: {
    slug: string;
    environment_key: string;
    collection_key: string;
    parent_id?: number;
}) => Promise<number>;
type PageCreateSingle = (client: PoolClient, data: {
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
type PageUpdateSingle = (client: PoolClient, data: {
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
type PageDeleteSingle = (client: PoolClient, data: {
    id: number;
}) => Promise<PageT>;
type PageGetMultipleByIds = (client: PoolClient, data: {
    ids: Array<number>;
    environment_key: string;
}) => Promise<PageT[]>;
type PageGetNonCurrentHomepages = (client: PoolClient, data: {
    current_id: number;
    environment_key: string;
}) => Promise<PageT[]>;
type PageCheckSlugExistence = (client: PoolClient, data: {
    slug: string;
    id: number;
    environment_key: string;
}) => Promise<boolean>;
type PageUpdatePageToNonHomepage = (client: PoolClient, data: {
    id: number;
    slug: string;
}) => Promise<PageT>;
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
    static getMultiple: PageGetMultiple;
    static getSingle: PageGetSingle;
    static createSingle: PageCreateSingle;
    static updateSingle: PageUpdateSingle;
    static deleteSingle: PageDeleteSingle;
    static getMultipleByIds: PageGetMultipleByIds;
    static getSingleBasic: PageGetSingleBasic;
    static getSlugCount: PageGetSlugCount;
    static getNonCurrentHomepages: PageGetNonCurrentHomepages;
    static checkSlugExistence: PageCheckSlugExistence;
    static updatePageToNonHomepage: PageUpdatePageToNonHomepage;
}
export {};
//# sourceMappingURL=Page.d.ts.map