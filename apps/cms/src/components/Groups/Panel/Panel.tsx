import T from "@/translations";
import {
	type Component,
	type JSXElement,
	Show,
	onMount,
	createSignal,
	Switch,
	Match,
	createEffect,
	createMemo,
	type Accessor,
} from "solid-js";
import { FaSolidArrowLeft } from "solid-icons/fa";
import notifyIllustration from "@/assets/illustrations/notify.svg";
import type { ErrorResponse } from "@lucidcms/core/types";
import contentLocaleStore from "@/store/contentLocaleStore";
import { Dialog } from "@kobalte/core";
import Loading from "@/components/Partials/Loading";
import ErrorBlock from "@/components/Partials/ErrorBlock";
import Button from "@/components/Partials/Button";
import ErrorMessage from "@/components/Partials/ErrorMessage";
import ContentLocaleSelect from "@/components/Partials/ContentLocaleSelect";

interface PanelProps {
	open: boolean;
	setOpen: (_open: boolean) => void;
	onSubmit?: () => void;
	reset: () => void;
	hideFooter?: boolean;
	langauge?: {
		contentLocale?: boolean;
		hascontentLocaleError?: boolean;
		useDefaultcontentLocale?: boolean;
	};

	fetchState?: {
		isLoading?: boolean;
		isError?: boolean;
	};
	mutateState?: {
		isLoading?: boolean;
		isError?: boolean;
		isDisabled?: boolean;
		errors: ErrorResponse | undefined;
	};
	content: {
		title: string;
		description?: string;
		fetchError?: string;
		submit?: string;
	};
	children: (_props?: {
		contentLocale: Accessor<string | undefined>;
		setContentLocale: (_value: string) => void;
	}) => JSXElement;
}

export const Panel: Component<PanelProps> = (props) => {
	// ------------------------------
	// State
	const [getBodyMinHeight, setBodyMinHeight] = createSignal(0);
	const [contentLocale, setContentLocale] = createSignal<string | undefined>(
		undefined,
	);

	// ------------------------------
	// Refs
	let headerRef: HTMLDivElement | undefined;
	let footerRef: HTMLDivElement | undefined;

	// ------------------------------
	// Functions
	const setBodyHeightValue = () => {
		setTimeout(() => {
			if (headerRef || footerRef) {
				setBodyMinHeight(
					(headerRef?.offsetHeight || 0) +
						(footerRef?.offsetHeight || 0),
				);
			}
		});
	};
	const getDefaultContentLocale = () => {
		if (!props.langauge?.useDefaultcontentLocale)
			return contentLocaleStore.get.contentLocale;
		const defaultLocale = contentLocaleStore.get.locales.find(
			(locale) => locale.isDefault,
		);
		if (defaultLocale) return defaultLocale.code;
		return contentLocaleStore.get.contentLocale;
	};

	// ------------------------------
	// Mount
	onMount(() => {
		setBodyHeightValue();
	});

	// ------------------------------
	// Effects
	createEffect(() => {
		if (props.open) {
			// props.reset();
			setContentLocale(getDefaultContentLocale());
			setBodyHeightValue();
		}
		if (props.open === false) {
			props.reset();
		}
	});

	createEffect(() => {
		const defaultLang = getDefaultContentLocale();
		if (contentLocale() === undefined && defaultLang !== undefined)
			setContentLocale(defaultLang);
	});

	// ------------------------------
	// Memos
	const isLoading = createMemo(() => {
		if (!props.open) return false;
		setBodyHeightValue();
		return props.fetchState?.isLoading;
	});

	// ------------------------------
	// Render
	return (
		<Dialog.Root
			open={props.open}
			onOpenChange={() => props.setOpen(!props.open)}
		>
			<Dialog.Portal>
				<Dialog.Overlay class="fixed inset-0 z-40 bg-white bg-opacity-40 animate-animate-fade-out data-[expanded]:animate-animate-fade-in" />
				<div class="fixed inset-0 z-40 flex justify-end">
					<Dialog.Content
						class="w-full max-w-[800px] bg-container-3 animate-animate-slide-from-right-out data-[expanded]:animate-animate-slide-from-right-in outline-none overflow-y-auto"
						onPointerDownOutside={(e) => {
							const target = e.target as HTMLElement;
							if (target.hasAttribute("data-panel-ignore")) {
								e.stopPropagation();
								e.preventDefault();
							}
						}}
					>
						<div
							ref={headerRef}
							class="bg-container-2 border-b border-border p-15 md:p-30"
						>
							<div class="w-full mb-2.5">
								<Dialog.CloseButton class="flex items-center text-sm text-title">
									<FaSolidArrowLeft class="text-title mr-2" />
									back
								</Dialog.CloseButton>
							</div>
							<Switch>
								<Match when={isLoading()}>
									<div class="w-full">
										<div class="h-8 skeleton w-1/4" />
										<div class="h-6 skeleton w-full mt-2" />
									</div>
								</Match>
								<Match when={!isLoading()}>
									<Dialog.Title>
										{props.content.title}
									</Dialog.Title>
									<Show when={props.content.description}>
										<Dialog.Description class="block mt-1">
											{props.content.description}
										</Dialog.Description>
									</Show>
								</Match>
							</Switch>
							<Show when={props.langauge?.contentLocale}>
								<div class="mt-5">
									<ContentLocaleSelect
										value={contentLocale()}
										setValue={setContentLocale}
										hasError={
											props.langauge
												?.hascontentLocaleError
										}
									/>
								</div>
							</Show>
						</div>
						<form
							class="w-full"
							onSubmit={(e) => {
								e.preventDefault();
								if (props.onSubmit) props.onSubmit();
							}}
						>
							<div
								class="p-15 md:p-30 relative flex flex-col"
								style={{
									"min-height": `calc(100vh - ${getBodyMinHeight()}px)`,
								}}
							>
								<Switch
									fallback={props.children({
										contentLocale: contentLocale,
										setContentLocale: setContentLocale,
									})}
								>
									<Match when={isLoading()}>
										<Loading type="fill" />
									</Match>
									<Match when={props.fetchState?.isError}>
										<div class="min-h-[300px]">
											<ErrorBlock
												type={"fill"}
												content={{
													image: notifyIllustration,
													title:
														props.content
															.fetchError ||
														T()("error_title"),
													description: props.content
														.fetchError
														? ""
														: T()("error_message"),
												}}
											/>
										</div>
									</Match>
								</Switch>
							</div>
							<Show when={!isLoading() && !props.hideFooter}>
								<div
									ref={footerRef}
									class="p-15 md:p-30 border-t border-border flex justify-between items-center"
								>
									<Switch fallback={<span />}>
										<Match
											when={
												props.mutateState?.errors
													?.message
											}
										>
											<ErrorMessage
												theme="basic"
												message={
													props.mutateState?.errors
														?.message
												}
											/>
										</Match>
									</Switch>
									<div class="flex min-w-max pl-5">
										<Button
											size="medium"
											theme="container-outline"
											type="button"
											onClick={() => props.setOpen(false)}
										>
											{T()("close")}
										</Button>
										<Show when={props.content.submit}>
											<Button
												type="submit"
												theme="primary"
												size="medium"
												classes="ml-15"
												loading={
													props.mutateState?.isLoading
												}
												disabled={
													props.mutateState
														?.isDisabled
												}
											>
												{props.content.submit}
											</Button>
										</Show>
									</div>
								</div>
							</Show>
						</form>
					</Dialog.Content>
				</div>
			</Dialog.Portal>
		</Dialog.Root>
	);
};
