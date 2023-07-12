import z from "zod";
import menusSchema from "../../schemas/menus";
export interface ServiceData {
    query: z.infer<typeof menusSchema.getMultiple.query>;
    environment_key: string;
}
declare const getMultiple: (data: ServiceData) => Promise<{
    data: import("../../utils/format/format-menu").MenuResT[];
    count: number;
}>;
export default getMultiple;
//# sourceMappingURL=get-multiple.d.ts.map