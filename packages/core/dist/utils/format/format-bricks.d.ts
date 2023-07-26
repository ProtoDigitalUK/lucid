import { CollectionBrickFieldsT } from "../../db/models/CollectionBrick";
import { FieldTypes } from "@lucid/brick-builder";
import { CollectionBrickT } from "../../db/models/CollectionBrick";
import { CollectionResT } from "@lucid/types/src/collections";
import { EnvironmentResT } from "@lucid/types/src/environments";
export interface BrickResT {
    id: CollectionBrickT["id"];
    key: CollectionBrickT["brick_key"];
    order: CollectionBrickT["brick_order"];
    type: CollectionBrickT["brick_type"];
    fields: Array<{
        fields_id: number;
        key: string;
        type: FieldTypes;
        value?: string | number | boolean | null | LinkValueT | MediaValueT | PageLinkValueT;
        items?: Array<Array<BrickResT["fields"][0]>>;
    }>;
}
export interface PageLinkValueT {
    id: number;
    target?: "_blank" | "_self";
    title?: string;
    slug?: string;
    full_slug?: string;
}
export interface LinkValueT {
    target?: "_blank" | "_self";
    url?: string;
}
export interface MediaValueT {
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
    collection: CollectionResT;
    environment: EnvironmentResT;
}) => Promise<BrickResT[]>;
export default formatBricks;
//# sourceMappingURL=format-bricks.d.ts.map