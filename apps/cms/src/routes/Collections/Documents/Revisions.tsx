import T from "@/translations";
import {
	type Component,
	createEffect,
	createMemo,
	For,
	Switch,
	Match,
} from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";
import contentLocaleStore from "@/store/contentLocaleStore";
import api from "@/services/api";
import Document from "@/components/Groups/Document";

const CollectionsDocumentsRevisionsRoute: Component = (props) => {
	// ----------------------------------
	// Hooks & State
	const params = useParams();
	const navigate = useNavigate();

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
	const canFetchRevisions = createMemo(() => {
		return contentLocale() !== undefined && documentId() !== undefined;
	});
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
	const revisionVersions = api.collections.document.useGetMultipleRevisions({
		queryParams: {
			queryString: () => "sort=createdAt",
			location: {
				collectionKey: collectionKey,
				documentId: documentId,
			},
		},
		enabled: () => canFetchRevisions(),
		refetchOnWindowFocus: false,
	});

	// ----------------------------------
	// Mutations

	// ----------------------------------
	// Memos
	const isLoading = createMemo(() => {
		return revisionVersions.isLoading || collection.isLoading || doc.isLoading;
	});
	const isSuccess = createMemo(() => {
		return collection.isSuccess && doc.isSuccess && revisionVersions.isSuccess;
	});
	const isPublished = createMemo(() => {
		return (
			doc.data?.data.version?.published?.id !== null &&
			doc.data?.data.version?.published?.id !== undefined
		);
	});

	// ---------------------------------
	// Functions

	// ---------------------------------
	// Effects
	createEffect(() => {
		if (versionIdParam() === "latest") {
			const latestVersion = revisionVersions.data?.data[0];
			if (latestVersion) {
				navigate(
					`/admin/collections/${collectionKey()}/revisions/${documentId()}/${latestVersion.id}`,
				);
			}
		}
	});

	// ----------------------------------
	// Render
	return (
		<Switch>
			<Match when={isLoading()}>
				<div class="fixed top-15 left-[325px] bottom-15 right-15 flex flex-col">
					<span class="h-32 w-full skeleton block mb-15" />
					<span class="h-64 w-full skeleton block mb-15" />
					<span class="h-full w-full skeleton block" />
				</div>
			</Match>
			<Match when={isSuccess()}>
				<Document.HeaderLayout
					state={{
						mode: "revisions",
						collectionKey: collectionKey,
						documentId: documentId,
						isPublished: isPublished,
						collection: collection.data?.data,
					}}
				>
					<div>
						<For each={revisionVersions.data?.data}>
							{(revisionVersion) => <div>{revisionVersion.id}</div>}
						</For>
					</div>
				</Document.HeaderLayout>
			</Match>
		</Switch>
	);
};

export default CollectionsDocumentsRevisionsRoute;
