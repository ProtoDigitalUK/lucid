import T from "../../translations/index.js";
import z from "zod";
import { type RequestQueryParsedT } from "../../middleware/validate-query.js";
import { APIError } from "../../utils/app/error-handler.js";
import formatRole from "../../format/format-roles.js";
import rolesSchema from "../../schemas/roles.js";

export interface ServiceData {
	query: z.infer<typeof rolesSchema.getMultiple.query>;
}

const getMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	console.log(true);
};

export default getMultiple;
