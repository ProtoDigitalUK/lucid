import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import type { OptionNameT } from "@headless/types/src/options.js";
import formatOptions from "../../format/format-options.js";

export interface ServiceData {
	name: OptionNameT;
}

const getSingle = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const optionRes = await serviceConfig.db
		.selectFrom("headless_options")
		.selectAll()
		.where("name", "=", data.name)
		.executeTakeFirst();

	if (optionRes === undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_found_name", {
				name: T("option"),
			}),
			message: T("error_not_found_message", {
				name: T("option"),
			}),
			status: 404,
		});
	}

	return formatOptions(optionRes);
};

export default getSingle;
