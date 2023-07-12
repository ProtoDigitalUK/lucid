export interface ServiceData {
    environment_key: string;
    id: number;
}
declare const getSingle: (data: ServiceData) => Promise<import("../../utils/format/format-menu").MenuResT>;
export default getSingle;
//# sourceMappingURL=get-single.d.ts.map