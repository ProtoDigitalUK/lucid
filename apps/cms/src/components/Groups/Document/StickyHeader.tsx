import T from "@/translations";
import {
	type Component,
	Show,
	createSignal,
	onMount,
	onCleanup,
	type Accessor,
} from "solid-js";
import { A } from "@solidjs/router";
import classNames from "classnames";
import { FaSolidChevronLeft, FaSolidTrash } from "solid-icons/fa";
import Layout from "@/components/Groups/Layout";
import Button from "@/components/Partials/Button";
import ContentLocaleSelect from "@/components/Partials/ContentLocaleSelect";
import type { CollectionResponse } from "@lucidcms/core/types";

export const StickyHeader: Component<{
	state: {
		mode: "create" | "edit" | "locked";
		version: "draft" | "published";
		collectionKey: Accessor<string>;
		documentId: Accessor<number | undefined>;
		collection?: CollectionResponse;
		brickTranslationErrors: Accessor<boolean>;
		canSaveDocument: Accessor<boolean>;
		panelOpen: Accessor<boolean>;
	};
	actions: {
		upsertDocumentAction: () => void;
		setPanelOpen: (_open: boolean) => void;
		setDeleteOpen: (_open: boolean) => void;
	};
}> = (props) => {
	// ---------------------------------
	// State
	const [getHeaderEle, setHeaderEle] = createSignal<HTMLElement>();
	const [getHasScrolled, setHasScrolled] = createSignal(false);

	// ---------------------------------
	// Functions
	const windowScroll = (e: Event) => {
		if (window.scrollY >= (getHeaderEle()?.offsetHeight || 0))
			setHasScrolled(true);
		else setHasScrolled(false);
	};

	// ---------------------------------
	// Effects
	onMount(() => {
		document.addEventListener("scroll", windowScroll, false);
	});
	onCleanup(() => {
		document.removeEventListener("scroll", windowScroll, false);
	});

	// ----------------------------------
	// Render
	return (
		<header
			style={{
				"view-transition-name": "document-builder-header",
			}}
			ref={setHeaderEle}
			class={classNames(
				"before:absolute before:inset-0 overflow-hidden border-x border-b border-border rounded-b-xl before:z-0 px-15 md:px-30 fixed top-0 left-[310px] right-15 z-40 duration-200 transition-all",
				{
					"py-15 md:py-15 before:bg-opacity-95 before:bg-container-1":
						getHasScrolled(),
					"py-15 md:py-30 before:bg-container-3": !getHasScrolled(),
				},
			)}
		>
			{/* Breadcrumb Top Bar */}
			<div
				class={classNames(
					"overflow-hidden transform-gpu duration-200 transition-all ",
					{
						"opacity-100": !getHasScrolled(),
						"opacity-0 -translate-y-full max-h-0 pointer-events-none":
							getHasScrolled(),
					},
				)}
			>
				<Layout.Breadcrumbs
					breadcrumbs={[
						{
							link: `/admin/collections/${props.state.collectionKey()}`,
							label: props.state.collection?.title || "",
							include: props.state.collection?.mode === "multiple",
						},
						{
							link: `/admin/collections/${props.state.collectionKey()}/draft/${
								props.state.mode === "create"
									? "create"
									: props.state.documentId()
							}`,
							label:
								props.state.mode === "create"
									? `${T()("create")} ${props.state.collection?.singular || T()("document")}`
									: `${T()("edit")} ${props.state.collection?.singular || T()("document")} (#${props.state.documentId()})`,
						},
					]}
					options={{
						noBorder: true,
						noPadding: true,
					}}
				/>
			</div>
			{/* Navigation */}
			<div
				class={classNames(
					"w-full border-b border-border flex items-center gap-15 relative z-10 transition-all duration-200",
					{
						"opacity-100 mt-15": !getHasScrolled(),
						"opacity-0 -translate-y-full max-h-0 pointer-events-none":
							getHasScrolled(),
					},
				)}
			>
				<A
					href={`/admin/collections/${props.state.collectionKey()}/draft/${props.state.documentId()}`}
					class="text-lg font-display pr-1 py-2 font-semibold after:absolute after:-bottom-px after:left-0 after:right-0 after:h-px relative cursor-pointer"
					activeClass="after:bg-primary-base"
				>
					{T()("draft")}
				</A>
				<A
					href={`/admin/collections/${props.state.collectionKey()}/published/${props.state.documentId()}`}
					class="text-lg font-display pr-1 py-2 font-semibold after:absolute after:-bottom-px after:left-0 after:right-0 after:h-px relative cursor-pointer"
					activeClass="after:bg-primary-base"
				>
					{T()("published")}
				</A>

				<span
					class="text-lg font-display px-1 py-2 font-semibold opacity-50 cursor-not-allowed"
					title="Coming soon"
				>
					{T()("revisions")}
				</span>
				<span
					class="text-lg font-display px-1 py-2 font-semibold opacity-50 cursor-not-allowed"
					title="Coming soon"
				>
					{T()("preview")}
				</span>
			</div>
			{/* Actions */}
			<div
				class={classNames(
					"w-full flex items-center gap-2.5 transition-all duration-200",
					{
						"mt-15": !getHasScrolled(),
					},
				)}
			>
				<Show when={props.state.collection?.translations}>
					<div class="w-full md:min-w-[220px]">
						<ContentLocaleSelect
							hasError={props.state.brickTranslationErrors()}
						/>
					</div>
				</Show>
				<Show
					when={props.state.mode === "edit" && props.state.version === "draft"}
				>
					<Button
						type="button"
						theme="primary"
						size="x-small"
						onClick={props.actions.upsertDocumentAction}
						disabled={props.state.canSaveDocument()}
					>
						{T()("save", {
							singular: props.state.collection?.singular || "",
						})}
					</Button>
				</Show>
				<Show
					when={
						props.state.mode === "edit" &&
						props.state.collection?.mode === "multiple"
					}
				>
					<Button
						theme="input-style"
						size="x-icon"
						type="button"
						onClick={() => props.actions.setDeleteOpen(true)}
					>
						<span class="sr-only">{T()("delete")}</span>
						<FaSolidTrash />
					</Button>
				</Show>
				<Show when={props.state.mode === "edit"}>
					<Button
						theme="input-style"
						size="x-icon"
						type="button"
						onClick={() => props.actions.setPanelOpen(!props.state.panelOpen())}
					>
						<span class="sr-only">{T()("toggle_panel")}</span>
						<FaSolidChevronLeft
							class={classNames(
								"transform-gpu transition-transform duration-200",
								{
									"rotate-180": props.state.panelOpen(),
								},
							)}
						/>
					</Button>
				</Show>
			</div>
		</header>
	);
};
