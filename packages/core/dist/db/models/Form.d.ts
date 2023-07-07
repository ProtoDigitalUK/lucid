import z from "zod";
import FormBuilder, { FormBuilderOptionsT } from "@lucid/form-builder";
import formsSchema from "../../schemas/forms";
type FormGetSingle = (data: {
    key: string;
    environment_key: string;
}) => Promise<FormT>;
type FormGetAll = (query: z.infer<typeof formsSchema.getAll.query>, environment_key: string) => Promise<FormT[]>;
export type FormT = {
    key: string;
    title: string;
    description: string | null;
    fields?: FormBuilderOptionsT["fields"];
};
export default class Form {
    #private;
    static getSingle: FormGetSingle;
    static getAll: FormGetAll;
    static getFormBuilderConfig: () => FormBuilder[];
    static getFormBuilderData: (instance: FormBuilder) => FormT;
}
export {};
//# sourceMappingURL=Form.d.ts.map