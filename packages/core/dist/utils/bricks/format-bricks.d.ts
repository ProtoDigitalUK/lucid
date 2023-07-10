import { CollectionBrickFieldsT, CollectionBrickT } from "../../db/models/CollectionBrick";
import { FieldTypes } from "@lucid/brick-builder";
import { CollectionT } from "../../services/collections";
export interface BrickResponseT {
    id: CollectionBrickT["id"];
    key: CollectionBrickT["brick_key"];
    order: CollectionBrickT["brick_order"];
    type: CollectionBrickT["brick_type"];
    fields: Array<{
        fields_id: number;
        key: string;
        type: FieldTypes;
        value?: string | number | boolean | null | LinkValueT | MediaValueT | PageLinkValueT;
        items?: Array<Array<BrickResponseT["fields"][0]>>;
    }>;
}
interface PageLinkValueT {
    id: number;
    target?: "_blank" | "_self";
    title?: string;
    slug?: string;
    full_slug?: string;
}
interface LinkValueT {
    target?: "_blank" | "_self";
    url?: string;
}
interface MediaValueT {
    id: number;
    url?: string;
    key?: string;
    mime_type?: string;
    file_extension?: string;
    file_size?: number;
    width?: number;
    height?: number;
    name?: string;
    alt?: string;
}
declare const formatBricks: (data: {
    brick_fields: CollectionBrickFieldsT[];
    environment_key: string;
    collection: CollectionT;
}) => Promise<BrickResponseT[]>;
export default formatBricks;
//# sourceMappingURL=format-bricks.d.ts.map