export interface ServiceData {
    ids: Array<number>;
    environment_key: string;
}
declare const getMultipleById: (data: ServiceData) => Promise<import("../../db/models/Page").PageT[]>;
export default getMultipleById;
//# sourceMappingURL=get-multiple-by-id.d.ts.map