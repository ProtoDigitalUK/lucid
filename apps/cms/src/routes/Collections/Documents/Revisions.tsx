import T from "@/translations";
import {
	type Component,
	createEffect,
	createMemo,
	For,
	Switch,
	Match,
	on,
	Show,
} from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";
import contentLocaleStore from "@/store/contentLocaleStore";
import { getDocumentRoute } from "@/utils/route-helpers";
import api from "@/services/api";
import brickStore from "@/store/brickStore";
import Document from "@/components/Groups/Document";
import Alert from "@/components/Blocks/Alert";
import DateText from "@/components/Partials/DateText";
import Pill from "@/components/Partials/Pill";
import Link from "@/components/Partials/Link";
import classNames from "classnames";

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
		if (versionIdParam() === "latest") {
			return collection.isSuccess && revisionVersions.isSuccess;
		}
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
					<Show when={!doc.data}>
						<div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 flex-col z-20">
							<div class="w-full max-w-xl px-15 py-15 text-center flex flex-col items-center">
								<h2 class="mb-2.5">{T()("no_revisions_found")}</h2>
								<p class="mb-30">{T()("no_revisions_found_message")}</p>
								<Link
									href={getDocumentRoute("edit", {
										collectionKey: collectionKey(),
										useDrafts: collection.data?.data.useDrafts,
										documentId: documentId(),
									})}
									theme="primary"
									size="medium"
								>
									{T()("back_to_document")}
								</Link>
							</div>
						</div>
					</Show>
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
										class={classNames(
											"bg-container-2 border-border border rounded-md mb-2.5 last:mb-0 flex flex-col p-15 focus:ring-1 focus:ring-primary-base duration-200 transition-colors hover:border-primary-base",
											{
												"border-primary-base":
													revisionVersion.id === versionId(),
											},
										)}
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
							<Show when={revisionVersions.data?.data.length === 0}>
								{T()("no_revisions_found")}
							</Show>
						</aside>
					</div>
				</Document.HeaderLayout>
			</Match>
		</Switch>
	);
};

export default CollectionsDocumentsRevisionsRoute;
