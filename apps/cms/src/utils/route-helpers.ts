export const getDocumentRoute = (
	mode: "create" | "edit",
	data: {
		collectionKey: string;
		useDrafts: boolean | undefined;
		documentId?: number;
	},
) => {
	const useDrafts = data.useDrafts ?? false;

	if (mode === "create") {
		if (useDrafts) {
			return `/admin/collections/${data.collectionKey}/draft/create`;
		}
		return `/admin/collections/${data.collectionKey}/published/create`;
	}

	if (useDrafts) {
		return `/admin/collections/${data.collectionKey}/draft/${data.documentId}`;
	}
	return `/admin/collections/${data.collectionKey}/published/${data.documentId}`;
};
