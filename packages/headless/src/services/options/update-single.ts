import T from "../../translations/index.js";
import { HeadlessAPIError } from "../../utils/error-handler.js";
import type { OptionNameT } from "../../types/response.js";
import type { BooleanInt } from "../../libs/db/types.js";
import Repository from "../../libs/repositories/index.js";

export interface ServiceData {
	name: OptionNameT;
	value_text?: string;
	value_int?: number;
	value_bool?: BooleanInt;
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
			valueBool: data.value_bool,
			valueInt: data.value_int,
			valueText: data.value_text,
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
