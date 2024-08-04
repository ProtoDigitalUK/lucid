import type { LucidHookCollection } from "@lucidcms/core/types";

const beforeUpsertHandler: LucidHookCollection<"beforeUpsert">["handler"] =
	async (props) => {
		console.log("pages plugin, beforeUpsertHandler");
		return props.data;
	};

export default beforeUpsertHandler;
