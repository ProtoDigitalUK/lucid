type PageCategoryCreate = (data: {
    page_id: number;
    category_ids: Array<number>;
}) => Promise<Array<PageCategoryT>>;
type PageCategoryDelete = (data: {
    page_id: number;
    category_ids: Array<number>;
}) => Promise<Array<PageCategoryT>>;
export type PageCategoryT = {
    page_id: number;
    category_id: number;
    id: number;
};
export default class PageCategory {
    static createMultiple: PageCategoryCreate;
    static getMultiple: (category_ids: Array<number>, collection_key: string) => Promise<{
        id: number;
    }[]>;
    static getMultipleByPageId: (page_id: number) => Promise<PageCategoryT[]>;
    static deleteMultiple: PageCategoryDelete;
}
export {};
//# sourceMappingURL=PageCategory.d.ts.map