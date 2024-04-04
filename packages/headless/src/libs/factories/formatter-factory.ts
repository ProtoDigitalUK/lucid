import T from "../../translations/index.js";
import { InternalError } from "../../utils/error-handler.js";
// Formatters
import UsersFormatter from "../../formatters/users.js";
import UserPermissionsFormatter from "../../formatters/user-permissions.js";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
class FormatterFactory {
	static getFormatter<T extends keyof FormatterClassMap>(
		format: T,
	): FormatterReturnType<T> {
		switch (format) {
			case "users":
				return new UsersFormatter() as FormatterReturnType<T>;
			case "user-permissions":
				return new UserPermissionsFormatter() as FormatterReturnType<T>;
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
};

type FormatterReturnType<T extends keyof FormatterClassMap> =
	FormatterClassMap[T];

export default FormatterFactory;
