import T from "@/translations";
import {
	Component,
	createMemo,
	createSignal,
	createEffect,
	Accessor,
} from "solid-js";
// Services
import api from "@/services/api";
// Utils
import helpers from "@/utils/helpers";
// Stores
import contentLanguageStore from "@/store/contentLanguageStore";
// Types
import type { CollectionResT } from "@headless/types/src/collections";
import type { SelectMultipleValueT } from "@/components/Groups/Form/SelectMultiple";
import type { PagesResT } from "@headless/types/src/multiple-page";
// Components
import Panel from "@/components/Groups/Panel";
import PageFieldGroup, {
	setDefualtTranslations,
} from "@/components/FieldGroups/Page";

interface CreateUpdatePagePanelProps {
	id?: Accessor<number | undefined>;
	collection: CollectionResT;
	state: {
		open: boolean;
		setOpen: (_state: boolean) => void;
	};
}

const CreateUpdatePagePanel: Component<CreateUpdatePagePanelProps> = (
	props,
) => {
	// ------------------------------
	// State
	const [getTitleTranslations, setTitleTranslations] = createSignal<
		PagesResT["title_translations"]
	>([]);
	const [getExcerptTranslations, setExcerptTranslations] = createSignal<
		PagesResT["excerpt_translations"]
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

	// ---------------------------------
	// Memos
	const panelMode = createMemo(() => {
		if (props.id === undefined) return "create";
		return "update";
	});
	const languages = createMemo(() => contentLanguageStore.get.languages);

	// ---------------------------------
	// Queries
	const categories = api.collections.categories.useGetMultiple({
		queryParams: {
			filters: {
				collection_key: props.collection.key,
			},
			perPage: -1,
		},
	});

	const page = api.collections.pages.useGetSingle({
		queryParams: {
			location: {
				id: props?.id,
			},
			include: {
				bricks: false,
			},
		},
		enabled: () => panelMode() === "update" && !!props.id?.(),
	});

	// ---------------------------------
	// Mutations
	const createPage = api.collections.pages.useCreateSingle({
		onSuccess: () => {
			props.state.setOpen(false);
		},
		collectionName: props.collection.singular,
	});

	const updatePage = api.collections.pages.useUpdateSingle({
		onSuccess: () => {
			props.state.setOpen(false);
		},
		collectionName: props.collection.singular,
	});

	// ---------------------------------
	// Memos
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

	const fetchIsLoading = createMemo(() => {
		if (panelMode() === "create") return categories.isLoading;
		return categories.isLoading || page.isLoading;
	});

	const fetchIsError = createMemo(() => {
		if (panelMode() === "create") return categories.isError;
		return categories.isError || page.isError;
	});

	const mutateIsLoading = createMemo(() => {
		if (panelMode() === "create") return createPage.action.isPending;
		return updatePage.action.isPending;
	});

	const mutateErrors = createMemo(() => {
		if (panelMode() === "create") return createPage.errors();
		return updatePage.errors();
	});

	const panelContent = createMemo(() => {
		if (panelMode() === "create") {
			return {
				title: T("create_page_panel_title", {
					name: props.collection.singular,
				}),
				description: T("create_page_panel_description", {
					collection: {
						value: props.collection.title,
						toLowerCase: true,
					},
				}),
				submit: T("create"),
			};
		}
		return {
			title: T("update_page_panel_title", {
				name: props.collection.singular,
			}),
			description: T("update_page_panel_description", {
				collection: {
					value: props.collection.singular,
					toLowerCase: true,
				},
			}),
			submit: T("update"),
		};
	});

	const hasTranslationErrors = createMemo(() => {
		const titleErrors =
			mutateErrors()?.errors?.body?.title_translations.children;
		const excerptErrors =
			mutateErrors()?.errors?.body?.excerpt_translations.children;
		if (titleErrors) return titleErrors.length > 0;
		if (excerptErrors) return excerptErrors.length > 0;
		return false;
	});

	// ---------------------------------
	// Functions

	// ---------------------------------
	// Effects
	createEffect(() => {
		if (page.isSuccess && categories.isSuccess) {
			setParentId(page.data?.data.parent_id || undefined);
			setIsHomepage(page.data?.data.homepage || false);
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
		}
	});

	createEffect(() => {
		if (panelMode() !== "create") return;
		if (getTitleTranslations().length === 0) {
			setTitleTranslations(
				setDefualtTranslations({
					translations: [],
					languages: languages(),
				}),
			);
		}
		if (getExcerptTranslations().length === 0) {
			setExcerptTranslations(
				setDefualtTranslations({
					translations: [],
					languages: languages(),
				}),
			);
		}
	});

	createEffect(() => {
		if (getIsHomepage()) {
			setParentId(undefined);
		}
	});

	// ---------------------------------
	// Render
	return (
		<Panel.Root
			open={props.state.open}
			setOpen={props.state.setOpen}
			onSubmit={() => {
				if (panelMode() === "update") {
					const body = updateData().data;
					updatePage.action.mutate({
						id: props.id?.() as number,
						body: {
							homepage: body.homepage,
							parent_id: body.parent_id,
							category_ids: body.category_ids,
							author_id: body.author_id,
							title_translations: body.title_translations || [],
							excerpt_translations:
								body.excerpt_translations || [],
						},
					});
				} else {
					createPage.action.mutate({
						body: {
							title_translations: getTitleTranslations(),
							excerpt_translations: getExcerptTranslations(),
							slug: getSlug(),
							collection_key: props.collection.key,
							homepage: getIsHomepage(),
							parent_id: getParentId(),
							category_ids: getSelectedCategories().map(
								(cat) => cat.value,
							) as number[],
						},
					});
				}
			}}
			reset={() => {
				updatePage.reset();
				createPage.reset();
				setTitleTranslations([]);
				setExcerptTranslations([]);
				setSlug(null);
				setParentId(undefined);
				setIsHomepage(false);
				setSelectedCategories([]);
			}}
			mutateState={{
				isLoading: mutateIsLoading(),
				errors: mutateErrors(),
				isDisabled: panelMode() === "update" && !updateData().changed,
			}}
			fetchState={{
				isLoading: fetchIsLoading(),
				isError: fetchIsError(),
			}}
			content={panelContent()}
			langauge={{
				contentLanguage: true,
				hasContentLanguageError: hasTranslationErrors(),
				useDefaultContentLanguage: panelMode() === "create",
			}}
		>
			{(lang) => (
				<PageFieldGroup
					mode={panelMode()}
					showTitles={true}
					state={{
						pageId: props.id,
						contentLanguage: lang?.contentLanguage,
						mutateErrors,
						collection: props.collection,
						categories: categories.data?.data || [],
						getTitleTranslations,
						getExcerptTranslations,
						getSlug,
						getIsHomepage,
						getParentId,
						getSelectedCategories,
						getSelectedAuthor,
					}}
					setState={{
						setTitleTranslations,
						setExcerptTranslations,
						setSlug,
						setIsHomepage,
						setParentId,
						setSelectedCategories,
						setSelectedAuthor,
					}}
				/>
			)}
		</Panel.Root>
	);
};

export default CreateUpdatePagePanel;
