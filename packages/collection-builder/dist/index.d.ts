interface CollectionOptions {
    config: {
        type: "pages" | "group";
        title: string;
        singular: string;
        description: string | undefined;
        bricks: string[];
    };
}
type CollectionBuilderT = InstanceType<typeof CollectionBuilder>;
declare const CollectionBuilder: {
    new (key: string, options: CollectionOptions): {
        key: string;
        config: CollectionOptions["config"];
        "__#1@#validateOptions": (options: CollectionOptions) => void;
    };
};
export { CollectionBuilderT };
export default CollectionBuilder;
//# sourceMappingURL=index.d.ts.map