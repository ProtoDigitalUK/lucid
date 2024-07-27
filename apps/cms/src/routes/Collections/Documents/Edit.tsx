import T from "@/translations";
import { useParams, useNavigate } from "@solidjs/router";
import {
	type Component,
	createMemo,
	createSignal,
	Show,
	Switch,
	Match,
	createEffect,
	onCleanup,
	onMount,
} from "solid-js";
import classNames from "classnames";
import type { CollectionResponse, FieldErrors } from "@lucidcms/core/types";
import api from "@/services/api";
import brickStore from "@/store/brickStore";
import brickHelpers from "@/utils/brick-helpers";
import { getBodyError } from "@/utils/error-helpers";
import contentLocaleStore from "@/store/contentLocaleStore";
import { FaSolidTrash, FaSolidArrowLeft } from "solid-icons/fa";
import Layout from "@/components/Groups/Layout";
import Button from "@/components/Partials/Button";
import ContentLocaleSelect from "@/components/Partials/ContentLocaleSelect";
import DetailsList from "@/components/Partials/DetailsList";
import DateText from "@/components/Partials/DateText";
import DeleteDocument from "@/components/Modals/Documents/DeleteDocument";
import NavigationGuard, {
	navGuardHook,
} from "@/components/Modals/NavigationGuard";
import Document from "@/components/Groups/Document";
import MediaSelectModal from "@/components/Modals/Media/MediaSelect";
import LinkSelectModal from "@/components/Modals/CustomField/LinkSelect";
import UserDisplay from "@/components/Partials/UserDisplay";
import BrickImagePreview from "@/components/Modals/Bricks/ImagePreview";
import Pill from "@/components/Partials/Pill";

interface CollectionsDocumentsEditRouteProps {
	mode: "create" | "edit";
}

const CollectionsDocumentsEditRoute: Component<
	CollectionsDocumentsEditRouteProps
> = (props) => {
	// ----------------------------------
	// Hooks & State
	const params = useParams();
	const navigate = useNavigate();
	const navGuard = navGuardHook({
		brickMutateLock: true,
	});
	const [getHeaderEle, setHeaderEle] = createSignal<HTMLElement>();
	const [getDeleteOpen, setDeleteOpen] = createSignal(false);
	const [getHasScrolled, setHasScrolled] = createSignal(false);

	// ----------------------------------
	// Memos
	const collectionKey = createMemo(() => params.collectionKey);
	const documentId = createMemo(
		() => Number.parseInt(params.documentId) || undefined,
	);
	const contentLocale = createMemo(
		() => contentLocaleStore.get.contentLocale,
	);
	const canFetchDocument = createMemo(() => {
		return contentLocale() !== undefined && documentId() !== undefined;
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
	const doc = api.collections.document.useGetSingle({
		queryParams: {
			location: {
				collectionKey: collectionKey,
				id: documentId(),
			},
			include: {
				bricks: true,
			},
		},
		enabled: () => canFetchDocument(),
		refetchOnWindowFocus: false,
	});

	// ----------------------------------
	// Mutations
	const upsertDocument = api.collections.document.useUpsertSingle({
		onSuccess: (data) => {
			brickStore.set("fieldsErrors", []);
			if (props.mode === "create") {
				navigate(
					`/admin/collections/${collectionKey()}/${data.data.id}`,
				);
			}
		},
		onError: (errors) => {
			brickStore.set(
				"fieldsErrors",
				getBodyError<FieldErrors[]>("fields", errors) || [],
			);
		},
		getCollectionName: () =>
			collection.data?.data.singular || T()("collection"),
	});

	// ----------------------------------
	// Memos
	const isLoading = createMemo(() => {
		return collection.isLoading || doc.isLoading;
	});
	const isSuccess = createMemo(() => {
		if (props.mode === "create") {
			return collection.isSuccess;
		}
		return collection.isSuccess && doc.isSuccess;
	});
	const isSaving = createMemo(() => {
		return upsertDocument.action.isPending;
	});
	const mutateErrors = createMemo(() => {
		return upsertDocument.errors();
	});
	const brickTranslationErrors = createMemo(() => {
		const errors = getBodyError<FieldErrors[]>("fields", mutateErrors());
		if (errors === undefined) return false;
		return errors.some((field) => field.localeCode !== contentLocale());
	});
	const canSaveDocument = createMemo(() => {
		return !brickStore.get.documentMutated && !isSaving();
	});

	// ---------------------------------
	// Functions
	const upsertDocumentAction = async () => {
		upsertDocument.action.mutate({
			collectionKey: collectionKey(),
			body: {
				documentId: documentId(),
				bricks: brickHelpers.getUpsertBricks(),
				fields: brickHelpers.getCollectionPseudoBrickFields(),
			},
		});
		brickStore.set("documentMutated", false);
	};
	const windowScroll = (e: Event) => {
		if (window.scrollY >= (getHeaderEle()?.offsetHeight || 0))
			setHasScrolled(true);
		else setHasScrolled(false);
	};

	// ---------------------------------
	// Effects
	createEffect(() => {
		if (isSuccess()) {
			brickStore.get.reset();
			brickStore.set(
				"collectionTranslations",
				collection.data?.data.translations || false,
			);
			brickStore.get.setBricks(doc.data?.data, collection.data?.data);
		}
	});
	createEffect(() => {
		collectionKey();
		documentId();
		setHasScrolled(false);
	});
	onMount(() => {
		setHasScrolled(false);
		document.addEventListener("scroll", windowScroll, false);
	});
	onCleanup(() => {
		brickStore.get.reset();
		setHasScrolled(false);
		document.removeEventListener("scroll", windowScroll, false);
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
				<header
					ref={setHeaderEle}
					class={classNames(
						"before:absolute before:inset-0 overflow-hidden before:bg-container-1 border-b before:z-0 border-border px-15 md:px-30 fixed top-0 left-[310px] right-0 z-10 duration-200 transition-all",
						{
							"py-15 md:py-15 before:bg-opacity-95":
								getHasScrolled(),
							"py-15 md:py-30": !getHasScrolled(),
						},
					)}
				>
					<div
						class={classNames(
							"overflow-hidden transform-gpu duration-200 transition-all ",
							{
								"opacity-100": !getHasScrolled(),
								"opacity-0 -translate-y-full max-h-0":
									getHasScrolled(),
							},
						)}
					>
						<Layout.PageBreadcrumbs
							breadcrumbs={[
								{
									link: `/admin/collections/${collectionKey()}`,
									label: collection.data?.data.title || "",
									include:
										collection.data?.data.mode ===
										"multiple",
								},
								{
									link: `/admin/collections/${collectionKey()}/${
										props.mode === "create"
											? "create"
											: documentId()
									}`,
									label:
										props.mode === "create"
											? `${T()("create")} ${collection.data?.data.singular || T()("document")}`
											: `${T()("edit")} ${collection.data?.data.singular || T()("document")} (#${doc.data?.data.id})`,
								},
							]}
							options={{
								noBorder: true,
								noPadding: true,
							}}
						/>
					</div>
					<div
						class={classNames(
							"flex items-end gap-15 lg:gap-30 flex-wrap-reverse lg:flex-nowrap transition-all duration-200",
							{
								"mt-15": !getHasScrolled(),
							},
						)}
					>
						<div class="w-full border-b border-border flex items-center gap-15 z-10">
							<span class="text-lg font-display pr-1 py-2 font-semibold after:absolute after:-bottom-px after:left-0 after:right-0 after:h-px after:bg-primary-base relative cursor-pointer">
								Content
							</span>
							<span
								class="text-lg font-display px-1 py-2 font-semibold opacity-50 cursor-not-allowed"
								title="Coming soon"
							>
								Preview
							</span>
							<span
								class="text-lg font-display px-1 py-2 font-semibold opacity-50 cursor-not-allowed"
								title="Coming soon"
							>
								Revisions
							</span>
						</div>
						<div class="w-full md:w-auto flex items-center gap-2.5">
							<Show when={collection.data?.data.translations}>
								<div class="w-full md:w-auto md:min-w-[220px]">
									<ContentLocaleSelect
										hasError={brickTranslationErrors()}
									/>
								</div>
							</Show>
							<Button
								type="button"
								theme="primary"
								size="x-small"
								onClick={upsertDocumentAction}
								disabled={canSaveDocument()}
							>
								{T()("save", {
									singular:
										collection.data?.data.singular || "",
								})}
							</Button>
							<Show
								when={
									props.mode === "edit" &&
									collection.data?.data.mode === "multiple"
								}
							>
								<Button
									theme="border-outline"
									size="xs-icon"
									type="button"
									onClick={() => setDeleteOpen(true)}
								>
									<span class="sr-only">{T()("delete")}</span>
									<FaSolidTrash />
								</Button>
							</Show>
						</div>
					</div>
				</header>
				<div class="w-full mt-[191px] lg:mt-[141px] flex overflow-x-hidden flex-grow">
					{/* Fields & Bricks */}
					<div class="w-full">
						<Document.CollectionPseudoBrick
							fields={collection.data?.data.fields || []}
						/>
						<Document.FixedBricks
							brickConfig={
								collection.data?.data.fixedBricks || []
							}
						/>
						<Document.BuilderBricks
							brickConfig={
								collection.data?.data.builderBricks || []
							}
						/>
					</div>
					{/* Sidebar */}
					<Show when={props.mode === "edit"}>
						<aside class="w-full lg:max-w-[300px] lg:overflow-y-auto bg-container-1 border-b lg:border-b-0 lg:border-l border-border">
							<div class="p-15 md:p-30">
								<h3 class="mb-15">{T()("metadata")}</h3>
								<DetailsList
									type="text"
									items={[
										{
											label: T()("collection"),
											value: collection.data?.data.title,
										},
										{
											label: T()("document_id"),
											value: doc.data?.data.id,
										},
										{
											label: T()("fixed_bricks"),
											value: collection.data?.data
												.fixedBricks?.length,
										},
										{
											label: T()(
												"available_builder_bricks",
											),
											value: collection.data?.data
												.builderBricks?.length,
										},
										{
											label: T()("total_bricks"),
											value: brickStore.get.bricks.length,
										},
										{
											label: T()("field_errors"),
											value: (
												<Pill
													theme={
														brickStore.get
															.fieldsErrors
															?.length > 0
															? "red"
															: "grey"
													}
												>
													{`${brickStore.get.fieldsErrors?.length || 0}`}
												</Pill>
											),
										},
										{
											label: T()("created_at"),
											value: (
												<DateText
													date={
														doc.data?.data.createdAt
													}
												/>
											),
											show: props.mode === "edit",
										},
										{
											label: T()("created_by"),
											value: (
												<UserDisplay
													user={{
														username:
															doc.data?.data
																.createdBy
																?.username,
														firstName:
															doc.data?.data
																.createdBy
																?.firstName,
														lastName:
															doc.data?.data
																.createdBy
																?.lastName,
														thumbnail: undefined,
													}}
													mode="long"
												/>
											),
											stacked: true,
											show: props.mode === "edit",
										},
										{
											label: T()("last_updated_at"),
											value: (
												<DateText
													date={
														doc.data?.data.updatedAt
													}
												/>
											),
											show: props.mode === "edit",
										},
										{
											label: T()("last_updated_by"),
											value: (
												<UserDisplay
													user={{
														username:
															doc.data?.data
																.updatedBy
																?.username,
														firstName:
															doc.data?.data
																.updatedBy
																?.firstName,
														lastName:
															doc.data?.data
																.updatedBy
																?.lastName,
														thumbnail: undefined,
													}}
													mode="long"
												/>
											),
											stacked: true,
											show: props.mode === "edit",
										},
									]}
								/>
							</div>
						</aside>
					</Show>
				</div>
				{/* Modals */}
				<NavigationGuard
					state={{
						open: navGuard.getModalOpen(),
						setOpen: navGuard.setModalOpen,
						targetElement: navGuard.getTargetElement(),
						targetCallback: navGuard.getTargetCallback(),
					}}
				/>
				<MediaSelectModal />
				<LinkSelectModal />
				<BrickImagePreview />
				<DeleteDocument
					id={doc.data?.data.id}
					state={{
						open: getDeleteOpen(),
						setOpen: setDeleteOpen,
					}}
					collection={collection.data?.data as CollectionResponse}
					callbacks={{
						onSuccess: () => {
							navigate(
								`/admin/collections/${collection.data?.data.key}`,
							);
						},
					}}
				/>
				<Show when={isSaving()}>
					<div class="fixed inset-0 bg-white bg-opacity-40 animate-pulse z-50" />
				</Show>
			</Match>
		</Switch>
	);
};

export default CollectionsDocumentsEditRoute;
