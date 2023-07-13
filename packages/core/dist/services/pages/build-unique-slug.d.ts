export interface ServiceData {
    slug: string;
    homepage: boolean;
    environment_key: string;
    collection_key: string;
    parent_id?: number;
}
declare const buildUniqueSlug: (data: ServiceData) => Promise<string>;
export default buildUniqueSlug;
//# sourceMappingURL=build-unique-slug.d.ts.map