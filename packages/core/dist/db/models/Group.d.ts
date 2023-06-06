type GroupGetSingle = (collection_key: string) => Promise<GroupT>;
type GroupCreateOrUpdate = (collection_key: string, bricks: any) => Promise<GroupT>;
export type GroupT = {
    id: number;
    collection_key: string;
    created_at: string;
    updated_at: string;
};
export default class Group {
    static getSingle: GroupGetSingle;
    static createOrUpdate: GroupCreateOrUpdate;
}
export {};
//# sourceMappingURL=Group.d.ts.map