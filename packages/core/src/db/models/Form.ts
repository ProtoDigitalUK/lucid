import getDBClient from "@db/db";
// Utils
import { LucidError } from "@utils/error-handler";
import { queryDataFormat, SelectQueryBuilder } from "@utils/query-helpers";

// -------------------------------------------
// Types
type FormUpsertSingle = (data: {}) => Promise<FormT>;

// -------------------------------------------
// Form
export type FormT = {
  key: string;
  environment_key: string;

  title: string;
  description: string | null;

  created_at: string;
  updated_at: string;
};

export type FormDataT = {
  id: number;
  forms_key: string;

  name: string;
  text_value: string | null;
  number_value: number | null;
  boolean_value: boolean | null;

  created_at: string;
  updated_at: string;
};

export default class Form {
  // -------------------------------------------
  // Functions
  static upsertSingle: FormUpsertSingle = async (data) => {
    const client = await getDBClient;

    return {} as FormT;
  };

  // -------------------------------------------
  // Util Functions
}
