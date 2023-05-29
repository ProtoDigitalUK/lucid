type PostTypeGetAll = () => Promise<PostTypeT[]>;
type PostTypeCreateOrUpdate = (postType: PostTypeT) => Promise<PostTypeT>;
export type PostTypeT = {
    id?: number;
    key: string;
    name: string;
    singular_name: string;
};
export default class PostType {
    static getAll: PostTypeGetAll;
    static createOrUpdate: PostTypeCreateOrUpdate;
}
export {};
//# sourceMappingURL=PostType.d.ts.map