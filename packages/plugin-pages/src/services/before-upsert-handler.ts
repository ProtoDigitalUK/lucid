import type { LucidHookCollection } from "@lucidcms/core/types";

const beforeUpsertHandler: LucidHookCollection<"beforeUpsert">["handler"] =
	async (props) => {
		console.log("pages plugin, beforeUpsertHandler");

		// Get the parent page of the document - and the parent of those pages (recursively)
		// Work out the fullSlug based on the slugs of the parent pages and this page
		// Set the fullSlug value against the coresponding field
		// Do this for all translations of the field if translations are enabled

		return {
			error: undefined,
			data: props.data,
		};
	};

export default beforeUpsertHandler;
