import T from "../../translations/index.js";
import { APIError } from "../../utils/app/error-handler.js";
import { type OptionNameT } from "@headless/types/src/options.js";

export interface ServiceData {
	name: OptionNameT;
	value_text?: string;
	value_int?: number;
	value_bool?: boolean;
}

const updateSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const updateOption = await serviceConfig.db
		.updateTable("headless_options")
		.set({
			value_text: data.value_text,
			value_int: data.value_int,
			value_bool: data.value_bool,
		})
		.where("name", "=", data.name)
		.executeTakeFirst();

	if (updateOption.numUpdatedRows === 0n) {
		throw new APIError({
			type: "basic",
			name: T("dynamic_error_name", {
				name: T("option"),
			}),
			message: T("update_error_message", {
				name: T("option").toLowerCase(),
			}),
			status: 400,
		});
	}

	return;
};

export default updateSingle;
