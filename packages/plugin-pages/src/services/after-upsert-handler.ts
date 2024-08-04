import type { LucidHookCollection } from "@lucidcms/core/types";

const afterUpsertHandler: LucidHookCollection<"afterUpsert">["handler"] =
	async (props) => {
		console.log("pages plugin, afterUpsertHandler");
		return;
	};

export default afterUpsertHandler;
