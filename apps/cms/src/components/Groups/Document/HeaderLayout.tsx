import T from "@/translations";
import {
	type Component,
	Show,
	createSignal,
	onMount,
	onCleanup,
	type Accessor,
	createMemo,
	type JSXElement,
	createEffect,
} from "solid-js";
import { A } from "@solidjs/router";
import classNames from "classnames";
import { FaSolidChevronLeft, FaSolidTrash } from "solid-icons/fa";
import Layout from "@/components/Groups/Layout";
import Button from "@/components/Partials/Button";
import ContentLocaleSelect from "@/components/Partials/ContentLocaleSelect";
import { getDocumentRoute } from "@/utils/route-helpers";
import type { CollectionResponse } from "@lucidcms/core/types";

export const HeaderLayout: Component<{
	state: {
		mode: "create" | "edit";
		version: "draft" | "published";
		collectionKey: Accessor<string>;
		documentId: Accessor<number | undefined>;
		collection?: CollectionResponse;
		brickTranslationErrors: Accessor<boolean>;
		canSaveDocument: Accessor<boolean>;
		canPublishDocument: Accessor<boolean>;
		panelOpen: Accessor<boolean>;
		isPublished: Accessor<boolean>;
		isBuilderLocked: Accessor<boolean>;
	};
	actions: {
		upsertDocumentAction: () => void;
		setPanelOpen: (_open: boolean) => void;
		setDeleteOpen: (_open: boolean) => void;
		publishDocumentAction: () => void;
	};
	children?: JSXElement;
}> = (props) => {
	// ---------------------------------
	// State
	let headerRef: HTMLElement | undefined;
	let contentRef: HTMLDivElement | undefined;
	const [getHasScrolled, setHasScrolled] = createSignal(false);
	const [headerHeight, setHeaderHeight] = createSignal(191);

	// ---------------------------------
	// Functions
	const windowScroll = () => {
		setHasScrolled(window.scrollY > headerHeight());
	};
	const updateHeaderHeight = () => {
		if (headerRef) {
			const newHeight = headerRef.offsetHeight;
			if (newHeight !== headerHeight()) {
				setHeaderHeight(newHeight);
			}
		}
	};

	// ---------------------------------
	// Memos
	const showUpsertButton = createMemo(() => {
		if (props.state.isBuilderLocked()) return false;

		if (props.state.mode === "create") return true;
		if (props.state.version === "draft") return true;
		if (
			props.state.version === "published" &&
			props.state.collection?.useDrafts === false
		)
			return true;
		return false;
	});
	const showPublishButton = createMemo(() => {
		if (props.state.mode === "create" || props.state.isBuilderLocked())
			return false;
		if (props.state.version === "published") return false;
		return true;
	});

	// ---------------------------------
	// Effects
	onMount(() => {
		updateHeaderHeight();
		window.addEventListener("resize", updateHeaderHeight);
		document.addEventListener("scroll", windowScroll, { passive: true });

		const resizeObserver = new ResizeObserver(updateHeaderHeight);
		if (headerRef) {
			resizeObserver.observe(headerRef);
		}

		onCleanup(() => {
			window.removeEventListener("resize", updateHeaderHeight);
			document.removeEventListener("scroll", windowScroll);
			resizeObserver.disconnect();
		});
	});
	createEffect(() => {
		if (contentRef) {
			contentRef.style.marginTop = `${headerHeight()}px`;
			contentRef.style.opacity = "1";
		}
	});

	// ----------------------------------
	// Render
	return (
		<>
			<header
				style={{
					"view-transition-name": "document-builder-header",
				}}
				ref={headerRef}
				class={classNames(
					"before:absolute before:inset-0 overflow-hidden border-x border-b border-border rounded-b-xl before:z-0 px-15 md:px-30 fixed top-0 left-[310px] right-15 z-40 duration-200 ease-in-out transition-all",
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
						"overflow-hidden transform-gpu duration-200 transition-all ease-in-out",
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
								link:
									props.state.mode === "create"
										? getDocumentRoute("create", {
												collectionKey: props.state.collectionKey(),
												useDrafts: props.state.collection?.useDrafts,
											})
										: getDocumentRoute("edit", {
												collectionKey: props.state.collectionKey(),
												useDrafts: props.state.collection?.useDrafts,
												documentId: props.state.documentId(),
											}),
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
						"w-full border-b border-border flex items-center gap-15 relative z-10 transition-all duration-200 ease-in-out",
						{
							"opacity-100 mt-15": !getHasScrolled(),
							"opacity-0 -translate-y-full max-h-0 pointer-events-none":
								getHasScrolled(),
						},
					)}
				>
					<Show when={props.state.collection?.useDrafts}>
						<A
							href={
								props.state.mode !== "create"
									? getDocumentRoute("edit", {
											collectionKey: props.state.collectionKey(),
											useDrafts: props.state.collection?.useDrafts,
											documentId: props.state.documentId(),
										})
									: "#"
							}
							class={classNames(
								"text-lg font-display pr-1 py-2 font-semibold after:absolute after:-bottom-px after:left-0 after:right-0 after:h-px relative",
								{
									"opacity-50 cursor-not-allowed focus:ring-0 hover:text-inherit":
										props.state.mode === "create",
									"cursor-pointer": props.state.mode !== "create",
								},
							)}
							activeClass={classNames({
								"after:bg-primary-base": props.state.mode !== "create",
							})}
						>
							{T()("draft")}
						</A>
					</Show>
					<A
						href={
							props.state.isPublished()
								? `/admin/collections/${props.state.collectionKey()}/published/${props.state.documentId()}`
								: "#"
						}
						class={classNames(
							"text-lg font-display pr-1 py-2 font-semibold after:absolute after:-bottom-px after:left-0 after:right-0 after:h-px relative",
							{
								"opacity-50 cursor-not-allowed focus:ring-0 hover:text-inherit":
									!props.state.isPublished(),
								"cursor-pointer": props.state.isPublished(),
							},
						)}
						activeClass={classNames({
							"after:bg-primary-base": props.state.isPublished(),
						})}
						aria-disabled={!props.state.isPublished()}
						title={
							!props.state.isPublished() ? T()("document_not_published") : ""
						}
					>
						{T()("published")}
					</A>
					<Show when={props.state.collection?.useRevisions}>
						<span
							class="text-lg font-display px-1 py-2 font-semibold opacity-50 cursor-not-allowed"
							title="Coming soon"
						>
							{T()("revisions")}
						</span>
					</Show>
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
						"w-full flex items-center gap-2.5 transition-all duration-200 ease-in-out",
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
					<Show when={showUpsertButton()}>
						<Button
							type="button"
							theme="primary"
							size="x-small"
							onClick={props.actions.upsertDocumentAction}
							disabled={props.state.canSaveDocument()}
						>
							{T()("save")}
						</Button>
					</Show>
					<Show when={showPublishButton()}>
						<Button
							type="button"
							theme="primary"
							size="x-small"
							onClick={props.actions.publishDocumentAction}
							disabled={!props.state.canPublishDocument()}
						>
							{T()("publish")}
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
							onClick={() =>
								props.actions.setPanelOpen(!props.state.panelOpen())
							}
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
			<div
				ref={contentRef}
				class="w-full flex flex-col flex-grow overflow-hidden bg-container-3 rounded-t-xl border-x border-t border-border z-10 relative mt-[191px] duration-75 ease-out opacity-0 transition-all"
			>
				{props.children}
			</div>
		</>
	);
};
