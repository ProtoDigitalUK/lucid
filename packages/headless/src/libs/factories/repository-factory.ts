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
		db: DB,
	): RepositoryReturnType<T> {
		switch (repository) {
			case "user-tokens":
				return new UserTokens(db) as RepositoryReturnType<T>;
			case "collection-categories":
				return new CollectionCategories(db) as RepositoryReturnType<T>;
			case "collection-document-bricks":
				return new CollectionDocumentBricks(
					db,
				) as RepositoryReturnType<T>;
			case "collection-document-categories":
				return new CollectionDocumentCategories(
					db,
				) as RepositoryReturnType<T>;
			case "collection-document-fields":
				return new CollectionDocumentFields(
					db,
				) as RepositoryReturnType<T>;
			case "collection-document-groups":
				return new CollectionDocumentGroups(
					db,
				) as RepositoryReturnType<T>;
			case "collection-documents":
				return new CollectionDocuments(db) as RepositoryReturnType<T>;
			case "emails":
				return new Emails(db) as RepositoryReturnType<T>;
			case "languages":
				return new Languages(db) as RepositoryReturnType<T>;
			case "media":
				return new Media(db) as RepositoryReturnType<T>;
			case "options":
				return new Options(db) as RepositoryReturnType<T>;
			case "processed-images":
				return new ProcessedImages(db) as RepositoryReturnType<T>;
			case "role-permissions":
				return new RolePermissions(db) as RepositoryReturnType<T>;
			case "roles":
				return new Roles(db) as RepositoryReturnType<T>;
			case "translation-keys":
				return new TranslationKeys(db) as RepositoryReturnType<T>;
			case "translations":
				return new Translations(db) as RepositoryReturnType<T>;
			case "user-roles":
				return new UserRoles(db) as RepositoryReturnType<T>;
			case "users":
				return new Users(db) as RepositoryReturnType<T>;
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
