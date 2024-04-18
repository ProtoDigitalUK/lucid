import T from "../../translations/index.js";
import { HeadlessAPIError } from "../../utils/error-handler.js";
import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";
import type { OptionName } from "../../types/response.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

export interface ServiceData {
	name: OptionName;
}

const getSingle = async (serviceConfig: ServiceConfig, data: ServiceData) => {
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
		throw new HeadlessAPIError({
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
