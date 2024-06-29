import z from "zod";
import toolkitWrapper from "../toolkit-wrapper.js";
import lucidServices from "../../../services/index.js";
import type { HeadlessCollectionDocuments } from "../../db/types.js";
import type { ExtractServiceFnArgs } from "../../../utils/services/types.js";

const documentToolkit = {
	getSingle: async (query: {
		where: Partial<
			Record<
				keyof HeadlessCollectionDocuments,
				{
					value: string | number | null | string[] | number[];
					operator?: "=" | "<" | ">" | "<=" | ">=";
				}
			>
		>;
	}) => {},
	getMultiple: async (query: {
		where: Partial<
			Record<
				keyof HeadlessCollectionDocuments,
				{
					value: string | number | null | string[] | number[];
					operator?: "=" | "<" | ">" | "<=" | ">=";
				}
			>
		>;
		sort: Array<{
			key: string;
			value: "asc" | "desc";
		}>;
		page: number;
		perPage: number;
	}) => {},
};

export default documentToolkit;
