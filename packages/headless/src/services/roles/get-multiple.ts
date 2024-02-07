import T from "../../translations/index.js";
import { APIError } from "../../utils/app/error-handler.js";
import { roles } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import formatRole from "../../format/format-roles.js";

export interface ServiceData {}

const getMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {};

export default getMultiple;
