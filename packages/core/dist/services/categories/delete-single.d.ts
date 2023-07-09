export interface ServiceData {
    id: number;
    environment_key: string;
}
declare const deleteSingle: (data: ServiceData) => Promise<import("../../db/models/Category").CategoryT>;
export default deleteSingle;
//# sourceMappingURL=delete-single.d.ts.map