import T from "@/translations";
import {
	type Component,
	createEffect,
	createMemo,
	For,
	Switch,
	Match,
	on,
} from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";
import contentLocaleStore from "@/store/contentLocaleStore";
import api from "@/services/api";
import brickStore from "@/store/brickStore";
import Document from "@/components/Groups/Document";
import Alert from "@/components/Blocks/Alert";
import DateText from "@/components/Partials/DateText";
import Pill from "@/components/Partials/Pill";

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
	const setDocumentState = () => {
		brickStore.get.reset();
		brickStore.set(
			"collectionTranslations",
			collection.data?.data.translations || false,
		);
		brickStore.get.setBricks(doc.data?.data, collection.data?.data);
		brickStore.set("locked", true);
	};

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

	createEffect(
		on(
			() => doc.data,
			() => {
				setDocumentState();
			},
		),
	);
	createEffect(
		on(
			() => collection.isSuccess,
			() => {
				setDocumentState();
			},
		),
	);

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
					<Alert
						style="layout"
						alerts={[
							{
								type: "warning",
								message: T()("locked_document_message"),
								show: true,
							},
						]}
					/>
					<div class="w-full flex flex-grow">
						{/* Fields & Bricks */}
						<div class="w-full flex flex-col">
							<Document.CollectionPseudoBrick
								fields={collection.data?.data.fields || []}
							/>
							<Document.FixedBricks
								brickConfig={collection.data?.data.fixedBricks || []}
							/>
							<Document.BuilderBricks
								brickConfig={collection.data?.data.builderBricks || []}
							/>
						</div>
						{/* Sidebar */}
						<aside
							class={
								"w-full lg:max-w-[300px] p-15 md:p-30 lg:overflow-y-auto bg-container-5 border-b lg:border-b-0 lg:border-l border-border"
							}
						>
							<h2 class="mb-15">{T()("revision_history")}</h2>
							<For each={revisionVersions.data?.data}>
								{(revisionVersion) => (
									<button
										type="button"
										class="bg-container-2 border-border border rounded-md mb-2.5 last:mb-0 flex flex-col p-15 focus:ring-1 focus:ring-primary-base duration-200 transition-colors hover:border-primary-base"
										onClick={() => {
											navigate(
												`/admin/collections/${collectionKey()}/revisions/${documentId()}/${revisionVersion.id}`,
											);
										}}
									>
										<h3 class="mb-1">
											{T()("revision")} #{revisionVersion.id}
										</h3>
										<DateText date={revisionVersion.createdAt} />
										<div class="mt-15 flex gap-2.5">
											<Pill theme="secondary">Fields 0</Pill>
											<Pill theme="secondary">
												Bricks {revisionVersion.bricks?.builder?.length ?? 0}
											</Pill>
											<Pill theme="secondary">
												Fixed {revisionVersion.bricks?.fixed?.length ?? 0}
											</Pill>
										</div>
									</button>
								)}
							</For>
						</aside>
					</div>
				</Document.HeaderLayout>
			</Match>
		</Switch>
	);
};

export default CollectionsDocumentsRevisionsRoute;
