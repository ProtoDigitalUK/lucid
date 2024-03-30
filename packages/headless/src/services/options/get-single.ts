import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import type { OptionNameT } from "@headless/types/src/options.js";
import formatOptions from "../../format/format-options.js";
import RepositoryFactory from "../../libs/factories/repository-factory.js";

export interface ServiceData {
	name: OptionNameT;
}

const getSingle = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const OptionsRepo = RepositoryFactory.getRepository(
		"options",
		serviceConfig.config,
	);

	const optionRes = await OptionsRepo.getSingle({
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

	return formatOptions({
		option: optionRes,
	});
};

export default getSingle;
