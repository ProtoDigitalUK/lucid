import T from "../../translations/index.js";
import { InternalError } from "../../utils/error-handler.js";
// Formatters
import UsersFormatter from "./users.js";
import UserPermissionsFormatter from "./user-permissions.js";
import SettgingsFormatter from "./settings.js";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
class Formatter {
	static get<T extends keyof FormatterClassMap>(
		format: T,
	): FormatterReturnType<T> {
		switch (format) {
			case "users":
				return new UsersFormatter() as FormatterReturnType<T>;
			case "user-permissions":
				return new UserPermissionsFormatter() as FormatterReturnType<T>;
			case "settings":
				return new SettgingsFormatter() as FormatterReturnType<T>;
			default:
				throw new InternalError(
					T("cannot_find_formatter", {
						name: format,
					}),
				);
		}
	}
}

type FormatterClassMap = {
	users: UsersFormatter;
	"user-permissions": UserPermissionsFormatter;
	settings: SettgingsFormatter;
};

type FormatterReturnType<T extends keyof FormatterClassMap> =
	FormatterClassMap[T];

export default Formatter;
