export interface CollectionConfigT {
    key: string;
    title: string;
    singular: string;
    description: string | null;
    type: "pages" | "singlepage";
    bricks: Array<CollectionBrickConfigT>;
}
export interface CollectionOptions {
    type: "pages" | "singlepage";
    title: string;
    singular: string;
    description: string | undefined;
    bricks: Array<CollectionBrickConfigT>;
}
export interface CollectionBrickConfigT {
    key: string;
    type: "builder" | "fixed";
    position?: "standard" | "bottom" | "top" | "sidebar";
}
export type CollectionBuilderT = InstanceType<typeof CollectionBuilder>;
export default class CollectionBuilder {
    #private;
    key: string;
    config: CollectionOptions;
    constructor(key: string, options: CollectionOptions);
}
//# sourceMappingURL=index.d.ts.map