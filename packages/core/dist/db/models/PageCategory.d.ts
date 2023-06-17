type PageCategoryCreate = (data: {
    page_id: number;
    category_ids: Array<number>;
    collection_key: string;
}) => Promise<Array<PageCategoryT>>;
type PageCategoryDelete = (data: {
    page_id: number;
    category_ids: Array<number>;
}) => Promise<Array<PageCategoryT>>;
type PageCategoryUpdate = (data: {
    page_id: number;
    category_ids: Array<number>;
    collection_key: string;
}) => Promise<Array<PageCategoryT>>;
export type PageCategoryT = {
    page_id: number;
    category_id: number;
    id: number;
};
export default class PageCategory {
    static create: PageCategoryCreate;
    static delete: PageCategoryDelete;
    static update: PageCategoryUpdate;
    static checkCategoryPostType: (category_ids: Array<number>, collection_key: string) => Promise<void>;
}
export {};
//# sourceMappingURL=PageCategory.d.ts.map