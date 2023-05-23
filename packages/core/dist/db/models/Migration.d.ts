type MigrationAll = () => Promise<MigrationT[]>;
type MigrationCreate = (data: {
    file: string;
    rawSql: string;
}) => Promise<void>;
export type MigrationT = {
    id: string;
    file: string;
    created_at: string;
};
export default class Migration {
    static all: MigrationAll;
    static create: MigrationCreate;
}
export {};
//# sourceMappingURL=Migration.d.ts.map