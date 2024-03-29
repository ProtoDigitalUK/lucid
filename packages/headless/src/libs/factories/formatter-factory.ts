import T from "../../translations/index.js";
import { InternalError } from "../../utils/error-handler.js";

type FormatterType = "users";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
class FormatterFactory {
	static getFormatter(format: FormatterType) {
		switch (format) {
			default:
				throw new InternalError(
					T("cannot_find_formatter", {
						name: format,
					}),
				);
		}
	}
}

export default FormatterFactory;
