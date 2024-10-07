import T from "@/translations";
import { type Component, createEffect, createMemo } from "solid-js";
import { useParams } from "@solidjs/router";
import contentLocaleStore from "@/store/contentLocaleStore";
import api from "@/services/api";

const CollectionsDocumentsRevisionsRoute: Component = (props) => {
	// ----------------------------------
	// Hooks & State
	const params = useParams();

	// ----------------------------------
	// Memos
	const collectionKey = createMemo(() => params.collectionKey);
	const documentId = createMemo(
		() => Number.parseInt(params.documentId) || undefined,
	);
	const versionIdParam = createMemo(() => params.versionId);
	const versionId = createMemo(() => {
		if (versionIdParam() !== "latest") return Number.parseInt(versionIdParam());
		return undefined;
	});
	const contentLocale = createMemo(() => contentLocaleStore.get.contentLocale);
	const canFetchDocument = createMemo(() => {
		return (
			contentLocale() !== undefined &&
			documentId() !== undefined &&
			versionId() !== undefined
		);
	});

	// ----------------------------------
	// Queries
	const collection = api.collections.useGetSingle({
		queryParams: {
			location: {
				collectionKey: collectionKey,
			},
		},
		enabled: () => !!collectionKey(),
		refetchOnWindowFocus: false,
	});
	const doc = api.collections.document.useGetSingleVersion({
		queryParams: {
			location: {
				collectionKey: collectionKey,
				id: documentId,
				versionId: versionId,
			},
			include: {
				bricks: true,
			},
		},
		enabled: () => canFetchDocument(),
		refetchOnWindowFocus: false,
	});
	const revisionVersions = [];

	// ----------------------------------
	// Mutations

	// ----------------------------------
	// Memos

	// ---------------------------------
	// Functions

	// ---------------------------------
	// Effects
	createEffect(() => {
		if (versionIdParam() === "latest") {
			console.log("redirect to latest version after fetching");
		}
	});

	// ----------------------------------
	// Render
	return "revisions";
};

export default CollectionsDocumentsRevisionsRoute;
