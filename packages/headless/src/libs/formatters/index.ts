import T from "../../translations/index.js";
import { InternalError } from "../../utils/error-handler.js";
// Formatters
import UsersFormatter from "./users.js";
import UserPermissionsFormatter from "./user-permissions.js";
import RolesFormatter from "./roles.js";
import SettingsFormatter from "./settings.js";
import PermissionsFormatter from "./permissions.js";
import OptionsFormatter from "./options.js";
import MediaFormatter from "./media.js";
import LanguagesFormatter from "./languages.js";
import EmailsFormatter from "./emails.js";
import CollectionsFormatter from "./collections.js";

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
				return new SettingsFormatter() as FormatterReturnType<T>;
			case "roles":
				return new RolesFormatter() as FormatterReturnType<T>;
			case "permissions":
				return new PermissionsFormatter() as FormatterReturnType<T>;
			case "options":
				return new OptionsFormatter() as FormatterReturnType<T>;
			case "media":
				return new MediaFormatter() as FormatterReturnType<T>;
			case "languages":
				return new LanguagesFormatter() as FormatterReturnType<T>;
			case "emails":
				return new EmailsFormatter() as FormatterReturnType<T>;
			case "collections":
				return new CollectionsFormatter() as FormatterReturnType<T>;
			default:
				throw new InternalError(
					T("cannot_find_formatter", {
						name: format,
					}),
				);
		}
	}
	// helpers
	static formatDate = (date: Date | string | null): string | null => {
		if (typeof date === "string") {
			return date;
		}
		return date ? date.toISOString() : null;
	};
	static parseJSON = <T>(json: string | null | undefined): T | null => {
		if (!json) return null;
		try {
			return JSON.parse(json);
		} catch (error) {
			return null;
		}
	};
	static stringifyJSON = (
		json: Record<string, unknown> | null,
	): string | null => {
		if (!json) return null;
		return JSON.stringify(json);
	};
	static parseCount = (count: string | undefined) => {
		return Number.parseInt(count || "0") || 0;
	};
}

type FormatterClassMap = {
	users: UsersFormatter;
	"user-permissions": UserPermissionsFormatter;
	settings: SettingsFormatter;
	roles: RolesFormatter;
	permissions: PermissionsFormatter;
	options: OptionsFormatter;
	media: MediaFormatter;
	languages: LanguagesFormatter;
	emails: EmailsFormatter;
	collections: CollectionsFormatter;
};

type FormatterReturnType<T extends keyof FormatterClassMap> =
	FormatterClassMap[T];

export default Formatter;
