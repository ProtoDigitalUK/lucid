import { PoolClient } from "pg";
type PageCategoryCreate = (client: PoolClient, data: {
    page_id: number;
    category_ids: Array<number>;
}) => Promise<Array<PageCategoryT>>;
type PageCategoryGetMultiple = (client: PoolClient, data: {
    category_ids: Array<number>;
    collection_key: string;
}) => Promise<Array<PageCategoryT>>;
type PageCategoryDelete = (client: PoolClient, data: {
    page_id: number;
    category_ids: Array<number>;
}) => Promise<Array<PageCategoryT>>;
type PageCategoryGetMultipleByPageId = (client: PoolClient, data: {
    page_id: number;
}) => Promise<Array<PageCategoryT>>;
export type PageCategoryT = {
    page_id: number;
    category_id: number;
    id: number;
};
export default class PageCategory {
    static createMultiple: PageCategoryCreate;
    static getMultiple: PageCategoryGetMultiple;
    static getMultipleByPageId: PageCategoryGetMultipleByPageId;
    static deleteMultiple: PageCategoryDelete;
}
export {};
//# sourceMappingURL=PageCategory.d.ts.map