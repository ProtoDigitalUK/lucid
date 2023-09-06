import { LucidError, modelErrors } from "../../utils/app/error-handler.js";
import Option from "../../db/models/Option.js";
import formatOption from "../../utils/format/format-option.js";
import convertToType from "../../utils/options/convert-to-type.js";
const getByName = async (client, data) => {
    const option = await Option.getByName(client, {
        name: data.name,
    });
    if (!option) {
        throw new LucidError({
            type: "basic",
            name: "Option Not Found",
            message: "There was an error finding the option.",
            status: 500,
            errors: modelErrors({
                option_name: {
                    code: "not_found",
                    message: "Option not found.",
                },
            }),
        });
    }
    const convertOptionType = convertToType(option);
    return formatOption([convertOptionType]);
};
export default getByName;
//# sourceMappingURL=get-by-name.js.map