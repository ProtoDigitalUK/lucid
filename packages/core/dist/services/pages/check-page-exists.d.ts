export interface ServiceData {
    id: number;
    environment_key: string;
}
declare const checkPageExists: (data: ServiceData) => Promise<import("../../db/models/Page").PageT>;
export default checkPageExists;
//# sourceMappingURL=check-page-exists.d.ts.map