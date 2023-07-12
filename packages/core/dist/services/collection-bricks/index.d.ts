import { FieldTypes } from "@lucid/brick-builder";
import { CollectionBrickT } from "../../db/models/CollectionBrick";
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
declare const _default: {
    formatBricks: (data: {
        brick_fields: import("../../db/models/CollectionBrick").CollectionBrickFieldsT[];
        environment_key: string;
        collection: import("../collections").CollectionT;
    }) => Promise<BrickResponseT[]>;
    validateBricks: (data: {
        builder_bricks: {
            key: string;
            id?: number | undefined;
            fields?: ({
                key: string;
                type: import("@lucid/brick-builder").FieldTypesEnum;
                fields_id?: number | undefined;
                parent_repeater?: number | undefined;
                group_position?: number | undefined;
                value?: any;
                target?: any;
            } & {
                items?: ({
                    key: string;
                    type: import("@lucid/brick-builder").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & any)[] | undefined;
            })[] | undefined;
        }[];
        fixed_bricks: {
            key: string;
            id?: number | undefined;
            fields?: ({
                key: string;
                type: import("@lucid/brick-builder").FieldTypesEnum;
                fields_id?: number | undefined;
                parent_repeater?: number | undefined;
                group_position?: number | undefined;
                value?: any;
                target?: any;
            } & {
                items?: ({
                    key: string;
                    type: import("@lucid/brick-builder").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & any)[] | undefined;
            })[] | undefined;
        }[];
        collection: import("../collections").CollectionT;
        environment: import("../../db/models/Environment").EnvironmentT;
    }) => Promise<void>;
    updateMultiple: (data: import("./update-multiple").ServiceData) => Promise<void>;
    upsertSingle: (data: import("./upsert-single").ServiceData) => Promise<number>;
    upsertRepeater: (data: import("./upsert-repeater").ServiceData) => Promise<void>;
    checkFieldExists: (data: import("./check-field-exists").ServiceData) => Promise<void>;
    upsertField: (data: import("./upsert-field").ServiceData) => Promise<number>;
    getAll: (data: import("./get-all").ServiceData) => Promise<{
        builder_bricks: BrickResponseT[];
        fixed_bricks: BrickResponseT[];
    }>;
    deleteUnused: (data: import("./delete-unused").ServiceData) => Promise<void>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map