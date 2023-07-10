import z from "zod";
import formsSchema from "../../schemas/forms";
export interface ServiceData {
    query: z.infer<typeof formsSchema.getAll.query>;
    environment_key: string;
}
declare const getAll: (data: ServiceData) => Promise<import("../forms").FormT[]>;
export default getAll;
//# sourceMappingURL=get-all.d.ts.map