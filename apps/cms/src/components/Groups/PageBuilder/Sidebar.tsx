import {
	type Component,
	type Accessor,
	createMemo,
	type Setter,
	For,
	Show,
} from "solid-js";
// Stores
import contentLanguageStore from "@/store/contentLanguageStore";
import builderStore from "@/store/builderStore";
// Types
import type {
	ErrorResponse,
	CollectionResponse,
} from "@protoheadless/core/types";
import type { SelectMultipleValueT } from "@/components/Groups/Form/SelectMultiple";
import type { MultipleBuilderResT } from "@headless/types/src/multiple-builder"; // TODO: remove
import type { BrickConfigT } from "@headless/types/src/bricks"; // TODO: remove
import type { CategoryResT } from "@headless/types/src/categories"; // TODO: remove
// Components
import PageBuilder from "@/components/Groups/PageBuilder";
import PageFieldGroup from "@/components/FieldGroups/Page";
import classNames from "classnames";

interface SidebarProps {
	mode: "single" | "multiple";
	state: {
		brickConfig: BrickConfigT[];
		pageId?: number;
		collection: CollectionResponse;
		categories?: CategoryResT[];
		mutateErrors: Accessor<ErrorResponse | undefined>;
		getTitleTranslations?: Accessor<
			MultipleBuilderResT["title_translations"]
		>;
		getExcerptTranslations?: Accessor<
			MultipleBuilderResT["excerpt_translations"]
		>;
		getSlug?: Accessor<string | null>;
		getParentId?: Accessor<number | undefined>;
		getIsHomepage?: Accessor<boolean>;
		getSelectedCategories?: Accessor<SelectMultipleValueT[]>;
		getSelectedAuthor?: Accessor<number | undefined>;
	};
	setState?: {
		setTitleTranslations: Setter<MultipleBuilderResT["title_translations"]>;
		setExcerptTranslations: Setter<
			MultipleBuilderResT["excerpt_translations"]
		>;
		setSlug: Setter<string | null>;
		setParentId: Setter<number | undefined>;
		setIsHomepage: Setter<boolean>;
		setSelectedCategories: Setter<SelectMultipleValueT[]>;
		setSelectedAuthor: Setter<number | undefined>;
	};
}

export const Sidebar: Component<SidebarProps> = (props) => {
	// ------------------------------
	// Memos
	const contentLanguage = createMemo(
		() => contentLanguageStore.get.contentLanguage,
	);
	const pageId = createMemo(() => props.state.pageId);
	const fixedBricks = createMemo(() =>
		builderStore.get.bricks
			.filter((brick) => brick.type === "fixed")
			.sort((a, b) => a.order - b.order),
	);
	const sidebarBricks = createMemo(() =>
		fixedBricks().filter((brick) => brick.position === "sidebar"),
	);

	// ----------------------------------
	// Render
	return (
		<div
			class={classNames("max-h-screen overflow-y-auto hide-scrollbar", {
				"w-15": props.mode === "single" && sidebarBricks().length === 0,
				"w-[500px] p-15":
					props.mode === "multiple" || sidebarBricks().length > 0,
			})}
		>
			<ul>
				<Show when={props.mode === "multiple"}>
					<li class="w-full p-15 bg-container-1 border border-border rounded-md mb-15">
						<PageFieldGroup
							mode={"update"}
							showTitles={false}
							theme="basic"
							state={{
								pageId: pageId,
								contentLanguage: contentLanguage,
								mutateErrors: props.state.mutateErrors,
								collection: props.state.collection,
								categories: props.state.categories || [],
								getTitleTranslations: props.state
									.getTitleTranslations as Accessor<
									MultipleBuilderResT["title_translations"]
								>,
								getExcerptTranslations: props.state
									.getExcerptTranslations as Accessor<
									MultipleBuilderResT["excerpt_translations"]
								>,
								getSlug: props.state.getSlug as Accessor<
									string | null
								>,
								getIsHomepage: props.state
									.getIsHomepage as Accessor<boolean>,
								getParentId: props.state
									.getParentId as Accessor<
									number | undefined
								>,
								getSelectedCategories: props.state
									.getSelectedCategories as Accessor<
									SelectMultipleValueT[]
								>,
								getSelectedAuthor: props.state
									.getSelectedAuthor as Accessor<
									number | undefined
								>,
							}}
							setState={{
								setTitleTranslations: props.setState
									?.setTitleTranslations as Setter<
									MultipleBuilderResT["title_translations"]
								>,
								setExcerptTranslations: props.setState
									?.setExcerptTranslations as Setter<
									MultipleBuilderResT["excerpt_translations"]
								>,
								setSlug: props.setState?.setSlug as Setter<
									string | null
								>,
								setIsHomepage: props.setState
									?.setIsHomepage as Setter<boolean>,
								setParentId: props.setState
									?.setParentId as Setter<number | undefined>,
								setSelectedCategories: props.setState
									?.setSelectedCategories as Setter<
									SelectMultipleValueT[]
								>,
								setSelectedAuthor: props.setState
									?.setSelectedAuthor as Setter<
									number | undefined
								>,
							}}
						/>
					</li>
				</Show>
				<For each={sidebarBricks()}>
					{(brick) => (
						<PageBuilder.Brick
							state={{
								brick,
								brickConfig: props.state.brickConfig,
								alwaysOpen: true,
							}}
						/>
					)}
				</For>
			</ul>
		</div>
	);
};
