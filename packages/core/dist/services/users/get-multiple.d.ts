import z from "zod";
import usersSchema from "../../schemas/users";
export interface ServiceData {
    query: z.infer<typeof usersSchema.getMultiple.query>;
}
declare const getMultiple: (data: ServiceData) => Promise<{
    data: import("../../utils/format/format-user").UserResT[];
    count: number;
}>;
export default getMultiple;
//# sourceMappingURL=get-multiple.d.ts.map