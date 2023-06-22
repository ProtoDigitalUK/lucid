interface CollectionOptions {
    config: {
        type: "pages" | "group";
        title: string;
        singular: string;
        description: string | undefined;
        bricks: Array<{
            key: string;
            type: "builder" | "fixed";
            position?: "standard" | "bottom" | "top" | "sidebar";
        }>;
    };
}
type CollectionBuilderT = InstanceType<typeof CollectionBuilder>;
declare const CollectionBuilder: {
    new (key: string, options: CollectionOptions): {
        key: string;
        config: CollectionOptions["config"];
        "__#1@#removeDuplicateBricks": () => void;
        "__#1@#validateOptions": (options: CollectionOptions) => void;
    };
};
export { CollectionBuilderT };
export default CollectionBuilder;
//# sourceMappingURL=index.d.ts.map