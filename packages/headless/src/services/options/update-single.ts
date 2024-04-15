import T from "../../translations/index.js";
import { HeadlessAPIError } from "../../utils/error-handler.js";
import type { OptionNameT } from "../../types/response.js";
import type { BooleanInt } from "../../libs/db/types.js";
import Repository from "../../libs/repositories/index.js";

export interface ServiceData {
	name: OptionNameT;
	valueText?: string;
	valueInt?: number;
	valueBool?: BooleanInt;
}

const updateSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const OptionsRepo = Repository.get("options", serviceConfig.db);

	const updateOption = await OptionsRepo.updateSingle({
		where: [
			{
				key: "name",
				operator: "=",
				value: data.name,
			},
		],
		data: {
			valueBool: data.valueBool,
			valueInt: data.valueInt,
			valueText: data.valueText,
		},
	});

	if (updateOption === undefined) {
		throw new HeadlessAPIError({
			type: "basic",
			status: 400,
		});
	}

	return;
};

export default updateSingle;
