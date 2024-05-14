import T from "@/translations";
import {
	type Component,
	onMount,
	Switch,
	Match,
	Show,
	type JSXElement,
} from "solid-js";
import { FaSolidPlus, FaSolidTrash } from "solid-icons/fa";
import classNames from "classnames";
import Link from "@/components/Partials/Link";
import Button from "@/components/Partials/Button";
import ContentLanguageSelect from "@/components/Partials/ContentLanguageSelect";
import Layout from "@/components/Groups/Layout";

export interface PageHeadingProps {
	title: string;
	description?: string;
	children?: JSXElement;
	breadcrumbs?: {
		link: string;
		label: string;
	}[];
	state?: {
		isLoading?: boolean;
	};
	actions?: {
		delete?: {
			open: boolean;
			setOpen: (_open: boolean) => void;
			permission?: boolean;
		};
		create?: {
			open: boolean;
			setOpen: (_open: boolean) => void;
			permission?: boolean;
			label?: string;
		};
		createLink?: {
			link: string;
			label: string;
			permission?: boolean;
		};
		contentLanguage?: boolean;
	};
	options?: {
		noBorder?: boolean;
	};
}

export const PageHeading: Component<PageHeadingProps> = (props) => {
	let headerEle: HTMLElement | undefined;

	// ----------------------------------------
	// Functions
	function setHeaderHeight() {
		if (headerEle) {
			document.documentElement.style.setProperty(
				"--lucid-page-layout-header-height",
				`${headerEle.offsetHeight}px`,
			);
		}
	}

	// ----------------------------------------
	// Mount
	onMount(() => {
		setHeaderHeight();
		window.addEventListener("resize", setHeaderHeight);

		const observer = new MutationObserver(setHeaderHeight);
		if (headerEle)
			observer.observe(headerEle, { attributes: true, childList: true });

		return () => {
			window.removeEventListener("resize", setHeaderHeight);
			observer.disconnect();
		};
	});

	// ----------------------------------------
	// Render
	return (
		<header
			ref={headerEle}
			class={classNames("border-border ", {
				"border-b": !props.options?.noBorder,
			})}
		>
			<Layout.PageBreadcrumbs breadcrumbs={props.breadcrumbs} />
			<div
				class={
					"p-15 md:p-30 flex md:justify-between md:flex-row flex-col-reverse items-start"
				}
			>
				{/* Textarea */}
				<div class="max-w-4xl w-full">
					<Switch>
						<Match when={props.state?.isLoading}>
							<div class="w-full">
								<div class="h-10 skeleton w-1/4" />
								<div class="h-4 skeleton w-full mt-2" />
								<div class="h-4 skeleton w-full mt-2" />
							</div>
						</Match>
						<Match when={!props.state?.isLoading}>
							<h1>{props.title}</h1>
							<Show when={props.description}>
								<p class="mt-2">{props.description}</p>
							</Show>
						</Match>
					</Switch>
				</div>
				{/* Actions */}
				<Show when={props.actions}>
					<div class="flex items-center justify-end md:ml-5 mb-5 md:mb-0 w-full space-x-2.5">
						<Show
							when={
								props.actions?.contentLanguage !== undefined &&
								props.actions.contentLanguage !== false
							}
						>
							<div class="w-full md:max-w-[240px]">
								<ContentLanguageSelect />
							</div>
						</Show>
						<Show
							when={
								props.actions?.create !== undefined &&
								props.actions.create.permission !== false
							}
						>
							<Button
								type="submit"
								theme="primary"
								size="icon"
								onClick={() => {
									props.actions?.create?.setOpen(true);
								}}
							>
								<FaSolidPlus />
								<span class="sr-only">
									{props.actions?.create?.label ??
										T("create")}
								</span>
							</Button>
						</Show>
						<Show
							when={
								props.actions?.createLink !== undefined &&
								props.actions.createLink.permission !== false
							}
						>
							<Link
								theme="primary"
								size="icon"
								href={props.actions?.createLink?.link}
							>
								<FaSolidPlus />
								<span class="sr-only">
									{props.actions?.createLink?.label ??
										T("create")}
								</span>
							</Link>
						</Show>
						<Show
							when={
								props.actions?.delete !== undefined &&
								props.actions.delete.permission !== false
							}
						>
							<Button
								theme="danger"
								size="icon"
								type="button"
								onClick={() =>
									props.actions?.delete?.setOpen(true)
								}
							>
								<span class="sr-only">{T("delete")}</span>
								<FaSolidTrash />
							</Button>
						</Show>
					</div>
				</Show>
			</div>
			<div class="w-full">{props.children}</div>
		</header>
	);
};
