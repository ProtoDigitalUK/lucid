type PageCategoryCreate = (data: {
    page_id: number;
    category_ids: Array<number>;
    post_type_id: number;
}) => Promise<Array<PageCategoryT>>;
export type PageCategoryT = {
    page_id: number;
    category_id: number;
    id: number;
};
export default class PageCategory {
    static create: PageCategoryCreate;
    static checkCategoryPostType: (category_ids: Array<number>, post_type_id: number) => Promise<void>;
}
export {};
//# sourceMappingURL=PageCategory.d.ts.map