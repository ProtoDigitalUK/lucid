import T from "../translations/index.js";
import type { Config } from "../libs/config/config-schema.js";
import { InternalError } from "../utils/error-handler.js";
import UserTokens from "./user-tokens.js";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
class RepositoryFactory {
	static getRepository(repository: RepositoryType, config: Config) {
		switch (repository) {
			case "user-tokens":
				return new UserTokens(config);
			default:
				throw new InternalError(
					T("cannot_find_repository", {
						name: repository,
					}),
				);
		}
	}
}

export type RepositoryType = "user-tokens";
export default RepositoryFactory;
