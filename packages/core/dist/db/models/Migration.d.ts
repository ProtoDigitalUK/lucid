export type MigrationT = {
    id: string;
    file: string;
    created_at: string;
};
export default class Migration {
    constructor();
    static all(): Promise<never[] | import("postgres").RowList<MigrationT[]>>;
}
//# sourceMappingURL=Migration.d.ts.map