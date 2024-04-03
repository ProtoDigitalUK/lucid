import T from "../../translations/index.js";
import { InternalError } from "../../utils/error-handler.js";
// Repositories
import UserTokensRepo from "../../repositories/user-tokens.js";
import CollectionCategoriesRepo from "../../repositories/collection-categories.js";
import CollectionDocumentBricksRepo from "../../repositories/collection-document-bricks.js";
import CollectionDocumentCategoriesRepo from "../../repositories/collection-document-categories.js";
import CollectionDocumentFieldsRepo from "../../repositories/collection-document-fields.js";
import CollectionDocumentGroupsRepo from "../../repositories/collection-document-groups.js";
import CollectionDocumentsRepo from "../../repositories/collection-documents.js";
import EmailsRepo from "../../repositories/emails.js";
import LanguagesRepo from "../../repositories/languages.js";
import MediaRepo from "../../repositories/media.js";
import OptionsRepo from "../../repositories/options.js";
import ProcessedImagesRepo from "../../repositories/processed-images.js";
import RolePermissionsRepo from "../../repositories/role-permissions.js";
import RolesRepo from "../../repositories/roles.js";
import TranslationKeysRepo from "../../repositories/translation-keys.js";
import TranslationsRepo from "../../repositories/translations.js";
import UserRolesRepo from "../../repositories/user-roles.js";
import UsersRepo from "../../repositories/users.js";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
class RepositoryFactory {
	static getRepository<T extends keyof RepositoryClassMap>(
		repository: T,
		db: DB,
	): RepositoryReturnType<T> {
		switch (repository) {
			case "user-tokens":
				return new UserTokensRepo(db) as RepositoryReturnType<T>;
			case "collection-categories":
				return new CollectionCategoriesRepo(
					db,
				) as RepositoryReturnType<T>;
			case "collection-document-bricks":
				return new CollectionDocumentBricksRepo(
					db,
				) as RepositoryReturnType<T>;
			case "collection-document-categories":
				return new CollectionDocumentCategoriesRepo(
					db,
				) as RepositoryReturnType<T>;
			case "collection-document-fields":
				return new CollectionDocumentFieldsRepo(
					db,
				) as RepositoryReturnType<T>;
			case "collection-document-groups":
				return new CollectionDocumentGroupsRepo(
					db,
				) as RepositoryReturnType<T>;
			case "collection-documents":
				return new CollectionDocumentsRepo(
					db,
				) as RepositoryReturnType<T>;
			case "emails":
				return new EmailsRepo(db) as RepositoryReturnType<T>;
			case "languages":
				return new LanguagesRepo(db) as RepositoryReturnType<T>;
			case "media":
				return new MediaRepo(db) as RepositoryReturnType<T>;
			case "options":
				return new OptionsRepo(db) as RepositoryReturnType<T>;
			case "processed-images":
				return new ProcessedImagesRepo(db) as RepositoryReturnType<T>;
			case "role-permissions":
				return new RolePermissionsRepo(db) as RepositoryReturnType<T>;
			case "roles":
				return new RolesRepo(db) as RepositoryReturnType<T>;
			case "translation-keys":
				return new TranslationKeysRepo(db) as RepositoryReturnType<T>;
			case "translations":
				return new TranslationsRepo(db) as RepositoryReturnType<T>;
			case "user-roles":
				return new UserRolesRepo(db) as RepositoryReturnType<T>;
			case "users":
				return new UsersRepo(db) as RepositoryReturnType<T>;
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
	"user-tokens": UserTokensRepo;
	"collection-categories": CollectionCategoriesRepo;
	"collection-document-bricks": CollectionDocumentBricksRepo;
	"collection-document-categories": CollectionDocumentCategoriesRepo;
	"collection-document-fields": CollectionDocumentFieldsRepo;
	"collection-document-groups": CollectionDocumentGroupsRepo;
	"collection-documents": CollectionDocumentsRepo;
	emails: EmailsRepo;
	languages: LanguagesRepo;
	media: MediaRepo;
	options: OptionsRepo;
	"processed-images": ProcessedImagesRepo;
	"role-permissions": RolePermissionsRepo;
	roles: RolesRepo;
	"translation-keys": TranslationKeysRepo;
	translations: TranslationsRepo;
	"user-roles": UserRolesRepo;
	users: UsersRepo;
};

type RepositoryReturnType<T extends keyof RepositoryClassMap> =
	RepositoryClassMap[T];

export default RepositoryFactory;
