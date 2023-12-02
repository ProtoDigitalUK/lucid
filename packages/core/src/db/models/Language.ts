import { PoolClient } from "pg";
import z from "zod";
// Schema
import languagesSchema from "@schemas/languages.js";
// Utils
import {
  queryDataFormat,
  SelectQueryBuilder,
} from "@utils/app/query-helpers.js";

// -------------------------------------------
// Role
export type LanguageT = {
  id: number;
  code: string;
  is_default: boolean;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
};

export default class Language {
  static createSingle: LanguageCreateSingle = async (client, data) => {
    const { columns, aliases, values } = queryDataFormat({
      columns: ["code", "is_default", "is_enabled"],
      values: [data.code, data.is_default, data.is_enabled],
    });

    const roleRes = await client.query<{
      id: LanguageT["id"];
    }>({
      text: `INSERT INTO headless_languages (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING id`,
      values: values.value,
    });

    return roleRes.rows[0];
  };
  static getMultiple: LanguageGetMultiple = async (client, query_instance) => {
    const languages = client.query<LanguageT>({
      text: `SELECT ${query_instance.query.select} FROM headless_languages ${query_instance.query.where} ${query_instance.query.order} ${query_instance.query.pagination}`,
      values: query_instance.values,
    });

    const count = client.query<{ count: string }>({
      text: `SELECT COUNT(DISTINCT headless_languages.id) FROM headless_languages ${query_instance.query.where}`,
      values: query_instance.countValues,
    });

    const data = await Promise.all([languages, count]);

    return {
      data: data[0].rows,
      count: Number(data[1].rows[0].count),
    };
  };
  static getSingleByCode: LanguageGetSingleByCode = async (client, data) => {
    const roleRes = await client.query<LanguageT>({
      text: `SELECT * FROM headless_languages WHERE code = $1`,
      values: [data.code],
    });

    return roleRes.rows[0];
  };
  static getSingleByID: LanguageGetSingleByID = async (client, data) => {
    const roleRes = await client.query<LanguageT>({
      text: `SELECT * FROM headless_languages WHERE id = $1`,
      values: [data.id],
    });

    return roleRes.rows[0];
  };
  static getDefault: LanguageGetDefault = async (client) => {
    const roleRes = await client.query<LanguageT>({
      text: `SELECT * FROM headless_languages WHERE is_default = true`,
    });

    return roleRes.rows[0];
  };
  static updateSingle: LanguageUpdateSingle = async (client, data) => {
    const { columns, aliases, values } = queryDataFormat({
      columns: ["code", "is_default", "is_enabled", "updated_at"],
      values: [
        data.data.code,
        data.data.is_default,
        data.data.is_enabled,
        data.data.updated_at,
      ],
    });

    const roleRes = await client.query<{
      id: LanguageT["id"];
    }>({
      text: `UPDATE headless_languages SET ${
        columns.formatted.update
      } WHERE code = $${aliases.value.length + 1} RETURNING id`,
      values: [...values.value, data.code],
    });

    return roleRes.rows[0];
  };
  static deleteSingle: LanguageDeleteSingle = async (client, data) => {
    const lang = await client.query<{
      id: LanguageT["id"];
      is_default: LanguageT["is_default"];
    }>({
      text: `DELETE FROM headless_languages WHERE code = $1 RETURNING id, is_default`,
      values: [data.code],
    });

    return lang.rows[0];
  };
  static getMultipleByIds: LanguageGetMultipleByIds = async (client, data) => {
    const languages = await client.query<{
      id: LanguageT["id"];
    }>({
      text: `SELECT id FROM headless_languages WHERE id = ANY($1::int[])`,
      values: [data.ids],
    });

    return languages.rows;
  };
}

// -------------------------------------------
// Types
type LanguageCreateSingle = (
  client: PoolClient,
  data: z.infer<typeof languagesSchema.createSingle.body>
) => Promise<{
  id: LanguageT["id"];
}>;

type LanguageGetMultiple = (
  client: PoolClient,
  query_instance: SelectQueryBuilder
) => Promise<{
  data: LanguageT[];
  count: number;
}>;

type LanguageGetSingleByCode = (
  client: PoolClient,
  data: {
    code: LanguageT["code"];
  }
) => Promise<LanguageT>;

type LanguageGetSingleByID = (
  client: PoolClient,
  data: {
    id: LanguageT["id"];
  }
) => Promise<LanguageT>;

type LanguageUpdateSingle = (
  client: PoolClient,
  data: {
    code: LanguageT["code"];
    data: {
      code?: LanguageT["code"];
      is_default?: LanguageT["is_default"];
      is_enabled?: LanguageT["is_enabled"];
      updated_at?: LanguageT["updated_at"];
    };
  }
) => Promise<{
  id: LanguageT["id"];
}>;

type LanguageDeleteSingle = (
  client: PoolClient,
  data: {
    code: LanguageT["code"];
  }
) => Promise<{
  id: LanguageT["id"];
  is_default: LanguageT["is_default"];
}>;

type LanguageGetDefault = (client: PoolClient) => Promise<LanguageT>;

type LanguageGetMultipleByIds = (
  client: PoolClient,
  data: {
    ids: LanguageT["id"][];
  }
) => Promise<
  {
    id: LanguageT["id"];
  }[]
>;
