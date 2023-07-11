export interface ServiceData {
    environment_key: string;
    id: number;
}
declare const getSingle: (data: ServiceData) => Promise<{
    id: number;
    key: string;
    environment_key: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    items: import("../menu").ItemsRes[] | null;
}>;
export default getSingle;
//# sourceMappingURL=get-single.d.ts.map