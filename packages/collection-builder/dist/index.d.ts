export interface CollectionConfigT {
    key: string;
    title: string;
    singular: string;
    description: string | null;
    type: "pages" | "singlepage";
    bricks: Array<CollectionBrickT>;
}
export interface CollectionOptions {
    config: {
        type: "pages" | "singlepage";
        title: string;
        singular: string;
        description: string | undefined;
        bricks: Array<CollectionBrickT>;
    };
}
export interface CollectionBrickT {
    key: string;
    type: "builder" | "fixed";
    position?: "standard" | "bottom" | "top" | "sidebar";
}
export type CollectionBuilderT = InstanceType<typeof CollectionBuilder>;
declare const CollectionBuilder: {
    new (key: string, options: CollectionOptions): {
        key: string;
        config: CollectionOptions["config"];
        "__#1@#removeDuplicateBricks": () => void;
        "__#1@#addBrickDefaults": () => void;
        "__#1@#validateOptions": (options: CollectionOptions) => void;
    };
};
export default CollectionBuilder;
//# sourceMappingURL=index.d.ts.map