export interface ServiceData {
    data: {
        key: string;
        title?: string;
        assigned_bricks?: string[];
        assigned_collections?: string[];
        assigned_forms?: string[];
    };
    create: boolean;
}
declare const upsertSingle: (data: ServiceData) => Promise<import("../../utils/environments/format-environment").EnvironmentResT>;
export default upsertSingle;
//# sourceMappingURL=upsert-single.d.ts.map