import { CollectionT } from "../collections";
export interface ServiceData {
    reference_id: number;
    type: CollectionT["type"];
    environment_key: string;
    collection: CollectionT;
}
declare const getAll: (data: ServiceData) => Promise<{
    builder_bricks: import("../collection-bricks").BrickResponseT[];
    fixed_bricks: import("../collection-bricks").BrickResponseT[];
}>;
export default getAll;
//# sourceMappingURL=get-all.d.ts.map