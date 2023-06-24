import { BrickFieldsT, BrickT } from "../../db/models/BrickData";
import { CollectionT } from "../../db/models/Collection";
import { FieldTypes } from "@lucid/brick-builder";
export interface BrickResponseT {
    id: BrickT["id"];
    key: BrickT["brick_key"];
    order: BrickT["brick_order"];
    type: BrickT["brick_type"];
    fields: Array<{
        fields_id: number;
        key: string;
        type: FieldTypes;
        value?: any;
        meta?: {
            target?: "_blank" | "_self";
            title?: string;
            slug?: string;
        };
        items?: Array<BrickResponseT["fields"][0]>;
    }>;
}
declare const formatBricks: (brick_fields: BrickFieldsT[], environment_key: string, collection: CollectionT) => Promise<BrickResponseT[]>;
export default formatBricks;
//# sourceMappingURL=format-bricks.d.ts.map