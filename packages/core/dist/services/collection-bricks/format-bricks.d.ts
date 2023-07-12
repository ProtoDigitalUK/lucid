import { CollectionBrickFieldsT } from "../../db/models/CollectionBrick";
import { CollectionT } from "../collections";
import { BrickResponseT } from "../collection-bricks";
declare const formatBricks: (data: {
    brick_fields: CollectionBrickFieldsT[];
    environment_key: string;
    collection: CollectionT;
}) => Promise<BrickResponseT[]>;
export default formatBricks;
//# sourceMappingURL=format-bricks.d.ts.map