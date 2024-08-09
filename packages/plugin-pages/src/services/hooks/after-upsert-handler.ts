import type { LucidHookCollection } from "@lucidcms/core/types";

const afterUpsertHandler: LucidHookCollection<"afterUpsert">["handler"] =
	async (props) => {
		console.log("pages plugin, afterUpsertHandler");

		// Find all documents that have this as their parent page - and then the documents that have those as their parent pages (recursively)
		// For each document, work out the fullSlug based on the fullSlug of the parent page
		// Update the document with the fullSlug
		// This needs to be done for all translations of the field if translations are enabled

		return {
			error: undefined,
			data: undefined,
		};
	};

export default afterUpsertHandler;
