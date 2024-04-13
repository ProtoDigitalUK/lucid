import type { Config } from "../../types/config.js";
import type { HookServiceHandlers, ArgumentsType } from "../../types/hooks.js";
import type { CollectionBuilderT } from "../builders/collection-builder/index.js";

const executeHooks = async <
	S extends keyof HookServiceHandlers,
	E extends keyof HookServiceHandlers[S],
	HandlerArgs extends ArgumentsType<HookServiceHandlers[S][E]>,
	// @ts-expect-error
	Result extends Awaited<ReturnType<HookServiceHandlers[S][E]>>,
>(
	options: {
		service: S;
		event: E;
		config: Config;
		collectionInstance?: CollectionBuilderT;
	},
	...args: HandlerArgs
): Promise<Array<Result>> => {
	const results: Array<Result> = [];

	for (let i = 0; i < options.config.hooks.length; i++) {
		const hook = options.config.hooks[i];
		if (hook === undefined) continue;
		if (hook.service === options.service && hook.event === options.event) {
			// @ts-expect-error
			results.push(await hook.handler(...args));
		}
	}

	if (options.collectionInstance?.config.hooks === undefined) return results;

	for (let i = 0; i < options.collectionInstance.config.hooks.length; i++) {
		const hook = options.collectionInstance.config.hooks[i];
		if (hook === undefined) continue;
		if (hook.event === options.event) {
			// @ts-expect-error
			results.push(await hook.handler(...args));
		}
	}

	return results;
};

export default executeHooks;
