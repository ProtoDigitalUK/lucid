import T from "@/translations/index";
import {
	type Component,
	createSignal,
	createMemo,
	createEffect,
	Show,
	Switch,
	Match,
	onCleanup,
} from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import { FaSolidTrash } from "solid-icons/fa";
import { setDefualtTranslations } from "@/components/FieldGroups/Page";
// Services
import api from "@/services/api";
// Utils
import helpers from "@/utils/helpers";
// Stores
import builderStore from "@/store/builderStore";
import contentLanguageStore from "@/store/contentLanguageStore";
// Types
import type { SelectMultipleValueT } from "@/components/Groups/Form/SelectMultiple";
import type { MultipleBuilderResT } from "@headless/types/src/multiple-builder"; // TODO: remove
import type { CollectionResponse } from "@protoheadless/core/types";
// Components
import PageBuilder from "@/components/Groups/PageBuilder";
import Button from "@/components/Partials/Button";
import DeletePage from "@/components/Modals/Documents/DeleteDocument";
import ContentLanguageSelect from "@/components/Partials/ContentLanguageSelect";
import NavigationGuard, {
	navGuardHook,
} from "@/components/Modals/NavigationGuard";
import SelectMediaModal from "@/components/Modals/Media/SelectMedia";
import LinkSelect from "@/components/Modals/CustomField/LinkSelect";

const CollectionsMultipleBuilderEditRoute: Component = () => {
	// ------------------------------
	// Hooks
	const params = useParams();
	const navigate = useNavigate();
	const navGuard = navGuardHook();

	// ------------------------------
	// State
	const [getTitleTranslations, setTitleTranslations] = createSignal<
		MultipleBuilderResT["title_translations"]
	>([]);
	const [getExcerptTranslations, setExcerptTranslations] = createSignal<
		MultipleBuilderResT["excerpt_translations"]
	>([]);
	const [getSlug, setSlug] = createSignal<string | null>(null);
	const [getParentId, setParentId] = createSignal<number | undefined>(
		undefined,
	);
	const [getIsHomepage, setIsHomepage] = createSignal<boolean>(false);
	const [getSelectedCategories, setSelectedCategories] = createSignal<
		SelectMultipleValueT[]
	>([]);
	const [getSelectedAuthor, setSelectedAuthor] = createSignal<
		number | undefined
	>(undefined);

	// Modals
	const [getDeleteOpen, setDeleteOpen] = createSignal(false);

	// ----------------------------------
	// Params
	const pageId = createMemo(() => Number(params.id));
	const collectionKey = createMemo(() => params.collectionKey);

	// ----------------------------------
	// Queries
	const categories = api.collections.categories.useGetMultiple({
		queryParams: {
			filters: {
				collection_key: collectionKey,
			},
			perPage: -1,
		},
		enabled: () => !!collectionKey(),
	});
	const collection = api.collections.useGetSingle({
		queryParams: {
			location: {
				collection_key: collectionKey,
			},
		},
		enabled: () => !!collectionKey(),
	});
	const page = api.collections.multipleBuilder.useGetSingle({
		queryParams: {
			location: {
				id: pageId(),
			},
			include: {
				bricks: true,
			},
		},
		enabled: () => !!pageId(),
		refetchOnWindowFocus: false,
	});
	const brickConfig = api.brickConfig.useGetAll({
		queryParams: {
			include: {
				fields: true,
			},
			filters: {
				collection_key: collectionKey,
			},
		},
	});

	// ----------------------------------
	// Mutations
	const updatePage = api.collections.multipleBuilder.useUpdateSingle({
		onSuccess: () => {
			builderStore.set("fieldsErrors", []);
		},
		onError: (errors) => {
			builderStore.set(
				"fieldsErrors",
				errors?.errors?.body?.fields || [],
			);
		},
		collectionName: collection.data?.data.singular || "",
	});

	// ----------------------------------
	// Memos
	const languages = createMemo(() => contentLanguageStore.get.languages);
	const contentLanguage = createMemo(
		() => contentLanguageStore.get.contentLanguage,
	);

	const updateData = createMemo(() => {
		return helpers.updateData(
			{
				homepage: page.data?.data.homepage,
				parent_id: page.data?.data.parent_id || null,
				category_ids: page.data?.data.categories || [],
				author_id: page.data?.data.author?.id || null,
				title_translations: page.data?.data.title_translations || [],
				excerpt_translations:
					page.data?.data.excerpt_translations || [],
				slug: page.data?.data.slug || null,
			},
			{
				homepage: getIsHomepage(),
				parent_id: getParentId() || null,
				category_ids: getSelectedCategories().map(
					(cat) => cat.value,
				) as number[],
				author_id: getSelectedAuthor() || null,
				title_translations: getTitleTranslations(),
				excerpt_translations: getExcerptTranslations(),
				slug: getSlug(),
			},
		);
	});

	const isLoading = createMemo(() => {
		return (
			categories.isLoading ||
			collection.isLoading ||
			page.isLoading ||
			brickConfig.isLoading
		);
	});
	const isSuccess = createMemo(() => {
		return (
			categories.isSuccess &&
			collection.isSuccess &&
			page.isSuccess &&
			brickConfig.isSuccess
		);
	});
	const isSaving = createMemo(() => {
		return updatePage.action.isPending;
	});
	const mutateErrors = createMemo(() => {
		return updatePage.errors();
	});

	const brickTranslationErrors = createMemo(() => {
		const errors = mutateErrors()?.errors?.body?.fields;
		if (errors === undefined) return false;
		return (
			errors.filter((field) => field.language_id !== contentLanguage())
				.length > 0
		);
	});
	const pageTranslationErrors = createMemo(() => {
		const titleErrors =
			mutateErrors()?.errors?.body?.titleTranslations?.children;
		const excerptErrors =
			mutateErrors()?.errors?.body?.excerptTranslations?.children;
		if (titleErrors) return titleErrors.length > 0;
		if (excerptErrors) return excerptErrors.length > 0;
		return false;
	});

	// ---------------------------------
	// Functions
	const savePage = async () => {
		const body = updateData().data;
		updatePage.action.mutate({
			id: pageId(),
			body: {
				homepage: body.homepage,
				parent_id: body.parent_id,
				category_ids: body.category_ids,
				author_id: body.author_id,
				title_translations: body.title_translations,
				excerpt_translations: body.excerpt_translations,
				slug: body.slug,
				bricks: builderStore.get.bricks,
			},
		});
	};

	// ---------------------------------
	// Effects
	createEffect(() => {
		if (isSuccess()) {
			builderStore.get.reset();
			setTitleTranslations(
				setDefualtTranslations({
					translations: page.data?.data.title_translations || [],
					languages: languages(),
				}),
			);
			setExcerptTranslations(
				setDefualtTranslations({
					translations: page.data?.data.excerpt_translations || [],
					languages: languages(),
				}),
			);
			setSlug(page.data?.data.slug || null);
			setParentId(page.data?.data.parent_id || undefined);
			setIsHomepage(page.data?.data.homepage || false);
			setSelectedCategories(
				categories.data?.data
					.filter((cat) => {
						return page.data?.data.categories?.includes(cat.id);
					})
					?.map((cat) => {
						return {
							value: cat.id,
							// TODO: return
							label:
								cat.title_translations[0]?.value || "No Title",
						};
					}) || [],
			);
			setSelectedAuthor(page.data?.data.author?.id || undefined);

			builderStore.set("bricks", page.data?.data.bricks || []);
			builderStore.get.addMissingFixedBricks(
				collection.data?.data.bricks || [],
			);
		}
	});

	onCleanup(() => {
		builderStore.get.reset();
	});

	// ----------------------------------
	// Render
	return (
		<>
			<header class="h-[60px] w-full bg-container-1 border-b border-border px-15 flex items-center justify-between">
				<h1 class="text-xl">
					{T("edit_page_route_title")}
					<span class="text-unfocused ml-2.5">
						#{page.data?.data.id}
					</span>
				</h1>
				<div class="flex items-center gap-2.5">
					<div class="min-w-[250px]">
						<ContentLanguageSelect
							hasError={
								brickTranslationErrors() ||
								pageTranslationErrors()
							}
						/>
					</div>
					<Button
						type="button"
						theme="primary"
						size="small"
						onClick={savePage}
					>
						{T("save", {
							singular: collection.data?.data.singular || "",
						})}
					</Button>
					<Button
						theme="danger"
						size="icon"
						type="button"
						onClick={() => setDeleteOpen(true)}
					>
						<span class="sr-only">{T("delete")}</span>
						<FaSolidTrash />
					</Button>
				</div>
			</header>
			<Switch>
				<Match when={isLoading()}>
					<div class="fixed top-[75px] left-[85px] bottom-15 right-15 flex">
						<span class="w-[500px] skeleton block h-full mr-15" />
						<span class="flex flex-col w-full h-full">
							<span class="h-10 w-full skeleton block mb-15" />
							<span class="h-full w-full skeleton block" />
						</span>
					</div>
				</Match>
				<Match when={isSuccess()}>
					<div class="relative h-[calc(100vh-60px)] w-full flex">
						{/* Sidebar Bricks & page fields */}
						<PageBuilder.Sidebar
							mode="multiple"
							state={{
								brickConfig: brickConfig.data?.data || [],
								pageId: pageId(),
								collection: collection.data
									?.data as CollectionResponse,
								categories: categories.data?.data || [],
								mutateErrors: mutateErrors,
								getTitleTranslations,
								getExcerptTranslations,
								getSlug,
								getParentId,
								getIsHomepage,
								getSelectedCategories,
								getSelectedAuthor,
							}}
							setState={{
								setTitleTranslations,
								setExcerptTranslations,
								setSlug,
								setParentId,
								setIsHomepage,
								setSelectedCategories,
								setSelectedAuthor,
							}}
						/>
						{/* Build */}
						<div class="h-full w-full p-15 pl-0">
							<PageBuilder.TopBar
								state={{
									brickConfig: brickConfig.data?.data || [],
									collection: collection.data?.data,
								}}
							/>
							<div class="w-full h-[calc(100%-55px)] bg-primary-base rounded-md brick-pattern relative">
								<div class="absolute inset-0 overflow-y-scroll z-10 right-[175px] p-15 hide-scrollbar">
									<PageBuilder.Builder
										state={{
											brickConfig:
												brickConfig.data?.data || [],
											collection: collection.data?.data,
										}}
									/>
								</div>
								<div class="absolute top-15 right-15 bottom-15 w-[160px] z-20 overflow-y-scroll hide-scrollbar">
									<PageBuilder.PreviewBar
										data={{
											brickConfig:
												brickConfig.data?.data || [],
										}}
									/>
								</div>
							</div>
						</div>
					</div>
					{/* Modals */}
					<DeletePage
						id={page.data?.data.id}
						state={{
							open: getDeleteOpen(),
							setOpen: setDeleteOpen,
						}}
						collection={collection.data?.data as CollectionResponse}
						callbacks={{
							onSuccess: () => {
								navigate(
									`/collection/${collection.data?.data.key}/multiple-builder`,
								);
							},
						}}
					/>
					<NavigationGuard
						state={{
							open: navGuard.getModalOpen(),
							setOpen: navGuard.setModalOpen,
							targetElement: navGuard.getTargetElement(),
						}}
					/>
					<SelectMediaModal />
					<LinkSelect />
					<Show when={isSaving()}>
						<div class="fixed inset-0 bg-black bg-opacity-50 z-50" />
					</Show>
				</Match>
			</Switch>
		</>
	);
};

export default CollectionsMultipleBuilderEditRoute;
