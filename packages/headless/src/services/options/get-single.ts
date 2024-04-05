import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";
import type { OptionNameT } from "../../types/response.js";

export interface ServiceData {
	name: OptionNameT;
}

const getSingle = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const OptionsRepo = Repository.get("options", serviceConfig.db);
	const OptionsFormatter = Formatter.get("options");

	const optionRes = await OptionsRepo.selectSingle({
		select: ["name", "value_bool", "value_int", "value_text"],
		where: [
			{
				key: "name",
				operator: "=",
				value: data.name,
			},
		],
	});

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

	return OptionsFormatter.formatSingle({
		option: optionRes,
	});
};

export default getSingle;
