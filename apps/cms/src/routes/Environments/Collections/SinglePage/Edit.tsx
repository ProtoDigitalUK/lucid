import T from "@/translations/index";
import {
	Component,
	createMemo,
	createEffect,
	Show,
	Switch,
	Match,
	onCleanup,
} from "solid-js";
import { useParams } from "@solidjs/router";
// Services
import api from "@/services/api";
// Stores
import { environment } from "@/store/environmentStore";
import builderStore from "@/store/builderStore";
import contentLanguageStore from "@/store/contentLanguageStore";
// Types
import type { CollectionResT } from "@headless/types/src/collections";
// Components
import PageBuilder from "@/components/Groups/PageBuilder";
import Button from "@/components/Partials/Button";
import ContentLanguageSelect from "@/components/Partials/ContentLanguageSelect";
import NavigationGuard, {
	navGuardHook,
} from "@/components/Modals/NavigationGuard";
import SelectMediaModal from "@/components/Modals/Media/SelectMedia";
import LinkSelect from "@/components/Modals/CustomField/LinkSelect";

const EnvCollectionsSinglePageEditRoute: Component = () => {
	// ------------------------------
	// Hooks
	const params = useParams();
	const navGuard = navGuardHook();

	// ----------------------------------
	// Params
	const collectionKey = createMemo(() => params.collectionKey);

	// ----------------------------------
	// Queries
	const collection = api.environment.collections.useGetSingle({
		queryParams: {
			location: {
				collection_key: collectionKey,
			},
			headers: {
				"headless-environment": environment,
			},
		},
		enabled: () => !!collectionKey(),
	});
	const singlePage = api.environment.collections.singlePages.useGetSingle({
		queryParams: {
			location: {
				collection_key: collectionKey,
			},
			headers: {
				"headless-environment": environment,
			},
		},
		enabled: () => !!collectionKey(),
		refetchOnWindowFocus: false,
	});
	const brickConfig = api.brickConfig.useGetAll({
		queryParams: {
			include: {
				fields: true,
			},
			filters: {
				collection_key: collectionKey,
				environment_key: environment,
			},
		},
	});

	// ----------------------------------
	// Mutations
	const updateSinglePage =
		api.environment.collections.singlePages.useUpdateSingle({
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
	const contentLanguage = createMemo(
		() => contentLanguageStore.get.contentLanguage,
	);

	const isLoading = createMemo(() => {
		return (
			collection.isLoading ||
			singlePage.isLoading ||
			brickConfig.isLoading
		);
	});
	const isSuccess = createMemo(() => {
		return (
			collection.isSuccess &&
			singlePage.isSuccess &&
			brickConfig.isSuccess
		);
	});
	const isSaving = createMemo(() => {
		return updateSinglePage.action.isPending;
	});
	const mutateErrors = createMemo(() => {
		return updateSinglePage.errors();
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
		const errors = mutateErrors()?.errors?.body?.translations?.children;
		if (errors) {
			return errors.length > 0;
		}
		return false;
	});

	// ---------------------------------
	// Functions
	const savePage = async () => {
		updateSinglePage.action.mutate({
			collection_key: collectionKey(),
			body: {
				bricks: builderStore.get.bricks,
			},
			headers: {
				"headless-environment": environment() || "",
			},
		});
	};

	// ---------------------------------
	// Effects
	createEffect(() => {
		if (isSuccess()) {
			builderStore.get.reset();
			builderStore.set("bricks", singlePage.data?.data.bricks || []);
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
			<header class="h-[60px] w-full bg-container border-b border-border px-15 flex items-center justify-between">
				<h1 class="text-xl">
					{T("edit_page_route_title_singular", {
						title: collection.data?.data.title || "",
					})}
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
				</div>
			</header>
			<Switch>
				<Match when={isLoading()}>
					<div class="fixed top-[75px] left-[325px] bottom-15 right-15 flex">
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
							mode="single"
							state={{
								brickConfig: brickConfig.data?.data || [],
								collection: collection.data
									?.data as CollectionResT,
								mutateErrors: mutateErrors,
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
							<div class="w-full h-[calc(100%-55px)] bg-primary rounded-md brick-pattern relative">
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

export default EnvCollectionsSinglePageEditRoute;
