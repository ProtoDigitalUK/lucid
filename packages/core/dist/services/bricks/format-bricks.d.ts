import { BrickFieldsT } from "../../db/models/BrickData";
import { FieldTypes } from "@lucid/brick-builder";
interface BrickResponseT {
    id: number;
    key: string;
    order: number;
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
declare const formatBricks: (brickFields: BrickFieldsT[]) => BrickResponseT[];
export default formatBricks;
//# sourceMappingURL=format-bricks.d.ts.map