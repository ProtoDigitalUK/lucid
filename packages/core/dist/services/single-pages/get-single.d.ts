export interface ServiceData {
    environment_key: string;
    collection_key: string;
    user_id: number;
    include_bricks?: boolean;
}
declare const getSingle: (data: ServiceData) => Promise<import("../../db/models/SinglePage").SinglePageT>;
export default getSingle;
//# sourceMappingURL=get-single.d.ts.map