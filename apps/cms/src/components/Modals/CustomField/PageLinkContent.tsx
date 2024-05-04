import T from "@/translations";
import { useParams } from "@solidjs/router";
import {
	type Component,
	Switch,
	createMemo,
	Match,
	createSignal,
	For,
	createEffect,
} from "solid-js";
// Store
import contentLanguageStore from "@/store/contentLanguageStore";
import linkFieldStore from "@/store/linkFieldStore";
// Services
import api from "@/services/api";
// Components
import Form from "@/components/Groups/Form";
import PageSearchRow from "@/components/Rows/PageSearchRow";
import Button from "@/components/Partials/Button";

const PageLinkContent: Component = () => {
	// ------------------------------
	// State
	const params = useParams();

	const [getPageId, setPageId] = createSignal<number>();
	const [getFullSlug, setFullSlug] = createSignal<string>("");
	const [getLabel, setLabel] = createSignal<string>("");
	const [getSearchQuery, setSearchQuery] = createSignal<string>("");
	const [getOpenInNewTab, setOpenInNewTab] = createSignal<boolean>(false);

	// ----------------------------------
	// Memos
	const collectionKey = createMemo(() => params.collectionKey);
	const contentLanguage = createMemo(
		() => contentLanguageStore.get.contentLanguage,
	);
	const selectedPageLink = createMemo(
		() => linkFieldStore.get.selectedPageLink,
	);
	const selectedMeta = createMemo(() => linkFieldStore.get.selectedMeta);

	// ----------------------------------
	// Queries
	const pages = api.collections.multipleBuilder.useGetMultiple({
		queryParams: {
			filters: {
				collection_key: collectionKey,
				title: getSearchQuery,
			},
			headers: {
				"headless-content-lang": contentLanguage,
			},
			perPage: 10,
		},
	});

	// ----------------------------------
	// Functions
	const updatePageLink = () => {
		linkFieldStore.get.onSelectCallback(
			{
				id: getPageId() || null,
				target: getOpenInNewTab() ? "_blank" : "_self",
				label: getLabel(),
			},
			{
				slug: getFullSlug(),
			},
		);
		linkFieldStore.set("open", false);
	};

	// ----------------------------------
	// Effects
	createEffect(() => {
		setFullSlug(selectedMeta()?.slug || "");
		setPageId(selectedPageLink()?.id || undefined);
		setLabel(selectedPageLink()?.label || "");
		setOpenInNewTab(selectedPageLink()?.target === "_blank");
	});

	// ------------------------------
	// Render
	return (
		<div class="p-15">
			<div class="mb-15 pb-15 border-b border-border">
				<h2>{T("set_page_link")}</h2>
			</div>
			<div class="mb-15 pb-15 border-b border-border">
				<Form.Input
					id="label"
					value={getLabel()}
					onChange={(value) => setLabel(value)}
					name={"label"}
					type="text"
					copy={{
						label: T("label"),
					}}
					required={false}
					theme={"basic"}
				/>
				<Form.Checkbox
					id="open_in_new_tab"
					value={getOpenInNewTab()}
					onChange={(value) => setOpenInNewTab(value)}
					name={"open_in_new_tab"}
					copy={{
						label: T("open_in_new_tab"),
					}}
					required={false}
					theme={"basic"}
				/>
			</div>
			<div class="">
				<Form.Search
					value={getSearchQuery()}
					onChange={(value) => setSearchQuery(value)}
					isLoading={pages.isLoading}
				/>
				<div class=" mt-2.5">
					<Switch>
						<Match when={pages.data?.data.length === 0}>
							<div class="text-center text-sm text-error-base border border-border p-15 rounded-md">
								{T("no_results")}
							</div>
						</Match>
						<Match
							when={
								pages.data?.data && pages.data?.data.length > 0
							}
						>
							<ul class="border border-border max-h-52 overflow-y-auto rounded-md">
								<For each={pages.data?.data}>
									{(page) => (
										<PageSearchRow
											page={page}
											contentLanguage={contentLanguage()}
											selectedId={getPageId()}
											onClick={(value: {
												slug: string;
												id: number;
												title: string;
											}) => {
												setFullSlug(value.slug);
												setPageId(value.id);
												setLabel(value.title);
											}}
										/>
									)}
								</For>
							</ul>
						</Match>
					</Switch>
				</div>
				<div class="text-sm flex items-center justify-between flex-wrap mb-2.5 mt-1">
					{T("selected")}
					<span>{getFullSlug()}</span>
				</div>
			</div>
			<div class="w-full flex justify-between mt-15">
				<Button
					type="button"
					theme="container-outline"
					size="x-small"
					onClick={() => {
						linkFieldStore.set("open", false);
					}}
				>
					{T("cancel")}
				</Button>
				<Button
					type="button"
					theme="primary"
					size="x-small"
					onClick={() => {
						updatePageLink();
					}}
				>
					{T("update")}
				</Button>
			</div>
		</div>
	);
};

export default PageLinkContent;
