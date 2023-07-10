import { FormBuilderOptionsT } from "@lucid/form-builder";
export type FormT = {
    key: string;
    title: string;
    description: string | null;
    fields?: FormBuilderOptionsT["fields"];
};
declare const _default: {
    getSingle: (data: import("./get-single").ServiceData) => Promise<FormT>;
    getAll: (data: import("./get-all").ServiceData) => Promise<FormT[]>;
    format: (instance: import("@lucid/form-builder").default) => FormT;
};
export default _default;
//# sourceMappingURL=index.d.ts.map