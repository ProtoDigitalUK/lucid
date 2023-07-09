export interface ServiceData {
    environment_key: string;
    id: number;
}
declare const deleteSingle: (data: ServiceData) => Promise<import("../../db/models/Menu").MenuT>;
export default deleteSingle;
//# sourceMappingURL=delete-single.d.ts.map