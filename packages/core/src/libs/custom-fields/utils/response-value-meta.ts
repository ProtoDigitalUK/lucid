import type { CFConfig, FieldTypes, CFResponse } from "../types.js";
import type { FieldProp } from "../../formatters/collection-document-fields.js";
// custom fields
import CheckboxCF from "../fields/checkbox.js";
import ColourCF from "../fields/colour.js";
import DateTimeCF from "../fields/datetime.js";
import JsonCF from "../fields/json.js";
import LinkCF from "../fields/link.js";
import MediaCF from "../fields/media.js";
import NumberCF from "../fields/number.js";
import RepeatableCF from "../fields/repeater.js";
import SelectCF from "../fields/select.js";
import TabCF from "../fields/tab.js";
import TextCF from "../fields/text.js";
import TextareaCF from "../fields/textarea.js";
import UserCF from "../fields/user.js";
import WysiwygCF from "../fields/wysiwyg.js";

const fieldResponseValueMeta = (props: {
	config: CFConfig<FieldTypes>;
	field: FieldProp;
	host: string;
}): CFResponse<FieldTypes> => {
	switch (props.config.type) {
		case "checkbox":
			return CheckboxCF.Config.responseValueFormat(
				props.config,
				props.field,
			);
		case "colour":
			return ColourCF.Config.responseValueFormat(
				props.config,
				props.field,
			);
		case "datetime":
			return DateTimeCF.Config.responseValueFormat(
				props.config,
				props.field,
			);
		case "json":
			return JsonCF.Config.responseValueFormat(props.config, props.field);
		case "link":
			return LinkCF.Config.responseValueFormat(props.config, props.field);
		case "media":
			return MediaCF.Config.responseValueFormat(props.field, props.host);
		case "number":
			return NumberCF.Config.responseValueFormat(
				props.config,
				props.field,
			);
		case "repeater":
			return RepeatableCF.Config.responseValueFormat();
		case "select":
			return SelectCF.Config.responseValueFormat(
				props.config,
				props.field,
			);
		case "tab":
			return TabCF.Config.responseValueFormat();
		case "text":
			return TextCF.Config.responseValueFormat(props.config, props.field);
		case "textarea":
			return TextareaCF.Config.responseValueFormat(
				props.config,
				props.field,
			);
		case "user":
			return UserCF.Config.responseValueFormat(props.field);
		case "wysiwyg":
			return WysiwygCF.Config.responseValueFormat(
				props.config,
				props.field,
			);
		default:
			return {
				value: null,
				meta: null,
			};
	}
};

export default fieldResponseValueMeta;
