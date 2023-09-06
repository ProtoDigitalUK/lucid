import { BrickFieldObject } from "../../db/models/CollectionBrick.js";
export interface ServiceData {
    brick_id: number;
    data: BrickFieldObject;
    mode: "create" | "update";
}
declare const generateFieldQuery: (data: ServiceData) => {
    columns: {
        value: string[];
        formatted: {
            insert: string;
            update: string;
            doUpdate: string;
            insertMultiple: string;
        };
    };
    aliases: {
        value: string[];
        formatted: {
            insert: string;
            update: string;
            insertMultiple: string;
        };
    };
    values: {
        value: any[];
        formatted: {
            insertMultiple: any[];
        };
    };
};
export default generateFieldQuery;
//# sourceMappingURL=generate-field-query.d.ts.map