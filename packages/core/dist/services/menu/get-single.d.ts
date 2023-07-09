export interface ServiceData {
    environment_key: string;
    id: number;
}
declare const getSingle: (data: ServiceData) => Promise<import("../../utils/menus/format-menu").MenuRes>;
export default getSingle;
//# sourceMappingURL=get-single.d.ts.map