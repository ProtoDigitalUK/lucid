export interface ServiceData {
    parent_id: number;
    environment_key: string;
    collection_key: string;
}
declare const parentChecks: (data: ServiceData) => Promise<import("../../db/models/Page").PageT>;
export default parentChecks;
//# sourceMappingURL=parent-checks.d.ts.map