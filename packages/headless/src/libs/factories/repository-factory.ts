import T from "../../translations/index.js";
import type { Config } from "../config/config-schema.js";
import { InternalError } from "../../utils/error-handler.js";
// Repositories
import UserTokens from "../../repositories/user-tokens.js";
import CollectionCategories from "../../repositories/collection-categories.js";
import CollectionDocumentBricks from "../../repositories/collection-document-bricks.js";
import CollectionDocumentCategories from "../../repositories/collection-document-categories.js";
import CollectionDocumentFields from "../../repositories/collection-document-fields.js";
import CollectionDocumentGroups from "../../repositories/collection-document-groups.js";
import CollectionDocuments from "../../repositories/collection-documents.js";
import Emails from "../../repositories/emails.js";
import Languages from "../../repositories/languages.js";
import Media from "../../repositories/media.js";
import Options from "../../repositories/options.js";
import ProcessedImages from "../../repositories/processed-images.js";
import RolePermissions from "../../repositories/role-permissions.js";
import Roles from "../../repositories/roles.js";
import TranslationKeys from "../../repositories/translation-keys.js";
import Translations from "../../repositories/translations.js";
import UserRoles from "../../repositories/user-roles.js";
import Users from "../../repositories/users.js";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
class RepositoryFactory {
	static getRepository<T extends keyof RepositoryClassMap>(
		repository: T,
		config: Config,
	): RepositoryReturnType<T> {
		switch (repository) {
			case "user-tokens":
				return new UserTokens(config) as RepositoryReturnType<T>;
			case "collection-categories":
				return new CollectionCategories(
					config,
				) as RepositoryReturnType<T>;
			case "collection-document-bricks":
				return new CollectionDocumentBricks(
					config,
				) as RepositoryReturnType<T>;
			case "collection-document-categories":
				return new CollectionDocumentCategories(
					config,
				) as RepositoryReturnType<T>;
			case "collection-document-fields":
				return new CollectionDocumentFields(
					config,
				) as RepositoryReturnType<T>;
			case "collection-document-groups":
				return new CollectionDocumentGroups(
					config,
				) as RepositoryReturnType<T>;
			case "collection-documents":
				return new CollectionDocuments(
					config,
				) as RepositoryReturnType<T>;
			case "emails":
				return new Emails(config) as RepositoryReturnType<T>;
			case "languages":
				return new Languages(config) as RepositoryReturnType<T>;
			case "media":
				return new Media(config) as RepositoryReturnType<T>;
			case "options":
				return new Options(config) as RepositoryReturnType<T>;
			case "processed-images":
				return new ProcessedImages(config) as RepositoryReturnType<T>;
			case "role-permissions":
				return new RolePermissions(config) as RepositoryReturnType<T>;
			case "roles":
				return new Roles(config) as RepositoryReturnType<T>;
			case "translation-keys":
				return new TranslationKeys(config) as RepositoryReturnType<T>;
			case "translations":
				return new Translations(config) as RepositoryReturnType<T>;
			case "user-roles":
				return new UserRoles(config) as RepositoryReturnType<T>;
			case "users":
				return new Users(config) as RepositoryReturnType<T>;
			default:
				throw new InternalError(
					T("cannot_find_repository", {
						name: repository,
					}),
				);
		}
	}
}

type RepositoryClassMap = {
	"user-tokens": UserTokens;
	"collection-categories": CollectionCategories;
	"collection-document-bricks": CollectionDocumentBricks;
	"collection-document-categories": CollectionDocumentCategories;
	"collection-document-fields": CollectionDocumentFields;
	"collection-document-groups": CollectionDocumentGroups;
	"collection-documents": CollectionDocuments;
	emails: Emails;
	languages: Languages;
	media: Media;
	options: Options;
	"processed-images": ProcessedImages;
	"role-permissions": RolePermissions;
	roles: Roles;
	"translation-keys": TranslationKeys;
	translations: Translations;
	"user-roles": UserRoles;
	users: Users;
};

type RepositoryReturnType<T extends keyof RepositoryClassMap> =
	RepositoryClassMap[T];

export default RepositoryFactory;
