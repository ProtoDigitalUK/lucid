import T from "@/translations";
import {
	type Component,
	Show,
	createSignal,
	For,
	Switch,
	Match,
	createMemo,
	createEffect,
} from "solid-js";
import classNames from "classnames";
import { debounce } from "@solid-primitives/scheduled";
// Types
import type { ErrorResult, FieldErrors } from "@protoheadless/core/types";
// Components
import { FaSolidCheck, FaSolidSort, FaSolidXmark } from "solid-icons/fa";
import { DropdownMenu } from "@kobalte/core";
import DropdownContent from "@/components/Partials/DropdownContent";
// Components
import Form from "@/components/Groups/Form";
import Spinner from "@/components/Partials/Spinner";

export type ValueT = string | number | undefined;

export interface SelectProps {
	id: string;
	value: ValueT;
	onChange: (_value: ValueT) => void;
	options: { value: ValueT; label: string }[];
	name: string;
	search?: {
		value: string;
		onChange: (_value: string) => void;
		isLoading: boolean;
	};
	copy?: {
		label?: string;
		describedBy?: string;
	};
	onBlur?: () => void;
	autoFoucs?: boolean;
	required?: boolean;
	disabled?: boolean;
	errors?: ErrorResult | FieldErrors;
	noMargin?: boolean;
	noClear?: boolean;
	hasError?: boolean;
	theme?: "basic";
}

export const Select: Component<SelectProps> = (props) => {
	const [open, setOpen] = createSignal(false);
	const [inputFocus, setInputFocus] = createSignal(false);
	const [debouncedValue, setDebouncedValue] = createSignal("");
	const [selectedLabel, setSelectedLabel] = createSignal("");

	// ----------------------------------------
	// Functions
	const setSearchQuery = debounce((value: string) => {
		setDebouncedValue(value);
	}, 500);

	// ----------------------------------------
	// Effects
	createEffect(() => {
		props.search?.onChange(debouncedValue());
	});

	createEffect(() => {
		if (props.value === undefined) {
			setSelectedLabel(T("nothing_selected"));
		}

		const selectedOption = props.options.find(
			(option) => option.value === props.value,
		);
		if (selectedOption) {
			setSelectedLabel(selectedOption.label);
		}
	});

	// ----------------------------------------
	// Memos
	const selectOptions = createMemo(() => {
		if (props.noClear) return props.options;

		const options = JSON.parse(JSON.stringify(props.options));
		options.unshift({
			value: undefined,
			label: T("clear"),
		});
		return options;
	});

	// ----------------------------------------
	// Render
	return (
		<div
			class={classNames("w-full", {
				"mb-0": props.noMargin,
				"mb-15 last:mb-0": !props.noMargin,
				"mb-2.5 last:mb-0": !props.noMargin && props.theme === "basic",
			})}
		>
			{/* Select */}
			<DropdownMenu.Root
				sameWidth={true}
				open={open()}
				onOpenChange={setOpen}
				flip={true}
				gutter={5}
			>
				<div
					class={classNames(
						"flex flex-col transition-colors duration-200 ease-in-out relative",
						{
							"border-primary-base bg-container-3":
								inputFocus() && props.theme !== "basic",
							"border-error-base":
								props.errors?.message !== undefined ||
								props.hasError,
							"bg-container-4 rounded-md border border-border":
								props.theme !== "basic",
						},
					)}
				>
					{/* Label */}
					<Form.Label
						id={props.id}
						label={props.copy?.label}
						focused={inputFocus()}
						required={props.required}
						theme={props.theme}
					/>
					{/* Trigger */}
					<DropdownMenu.Trigger
						class={classNames(
							"focus:outline-none px-2.5 text-sm text-title font-medium w-full flex justify-between",
							{
								"pt-2 h-10 flex items-center":
									props.copy?.label === undefined,
								"bg-container-1 border border-border flex items-center h-10 rounded-md mt-1 focus:border-primary-base duration-200 transition-colors":
									props.theme === "basic",
								"bg-transparent pb-2 pt-1 rounded-b-md":
									props.theme !== "basic",
							},
						)}
						onFocus={() => setInputFocus(true)}
						onBlur={() => setInputFocus(false)}
					>
						{selectedLabel() ? (
							<span class="truncate">{selectedLabel()}</span>
						) : (
							<span class="text-body">
								{T("nothing_selected")}
							</span>
						)}
						<FaSolidSort size={16} class="text-title ml-1" />
					</DropdownMenu.Trigger>
				</div>
				<DropdownContent
					options={{
						anchorWidth: true,
						rounded: true,
						class: "max-h-80 overflow-y-auto z-[70] !p-1.5",
					}}
				>
					<Show when={props.search !== undefined}>
						<div
							class="mb-1.5 sticky top-0"
							onKeyDown={(e) => {
								e.stopPropagation();
							}}
						>
							<div class="relative">
								<input
									type="text"
									class="bg-container-1 px-2.5 rounded-md w-full border border-border text-sm text-title font-medium h-10 focus:outline-none focus:border-primary-base"
									placeholder={T("search")}
									value={props.search?.value || ""}
									onKeyDown={(e) => {
										e.stopPropagation();
									}}
									onInput={(e) =>
										setSearchQuery(e.currentTarget.value)
									}
								/>

								<Switch>
									<Match when={props.search?.isLoading}>
										<div class="absolute right-2.5 top-0 bottom-0 flex items-center">
											<Spinner size="sm" />
										</div>
									</Match>
									<Match when={props.search?.value}>
										<div class="absolute right-2.5 top-0 bottom-0 flex items-center">
											<button
												type="button"
												class="bg-primary-base pointer-events-auto h-5 w-5 flex items-center justify-center rounded-full mr-1 fill-primary-contrast hover:bg-error-base hover:fill-white duration-200 transition-colors focus:outline-none focus:ring-1 ring-error-base focus:fill-error-base"
												onClick={() => {
													setDebouncedValue("");
												}}
												onKeyDown={(e) => {
													if (
														e.key === "Backspace" ||
														e.key === "Delete" ||
														e.key === "Enter" ||
														e.key === " "
													) {
														setDebouncedValue("");
													}
												}}
											>
												<FaSolidXmark size={14} />
												<span class="sr-only">
													{T("clear")}
												</span>
											</button>
										</div>
									</Match>
								</Switch>
							</div>
						</div>
					</Show>
					<Switch>
						<Match when={props.options.length > 0}>
							<ul class="flex flex-col">
								<For each={selectOptions()}>
									{(option) => (
										<li
											class="flex items-center justify-between text-sm text-body hover:bg-primary-hover hover:text-primary-contrast px-2.5 py-1 rounded-md cursor-pointer focus:outline-none focus:bg-primary-hover focus:text-primary-contrast"
											onClick={() => {
												props.onChange(option.value);
												setDebouncedValue("");
												setOpen(false);
											}}
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													props.onChange(
														option.value,
													);
													setDebouncedValue("");
													setOpen(false);
												}
											}}
										>
											<span>{option.label}</span>
											<Show
												when={
													props.value === option.value
												}
											>
												<FaSolidCheck
													size={14}
													class="text-current mr-2"
												/>
											</Show>
										</li>
									)}
								</For>
							</ul>
						</Match>
						<Match
							when={
								props.options.length === 0 &&
								props.search?.value
							}
						>
							<span class="text-primary-contrast w-full block px-2.5 py-1 text-sm">
								{T("no_results_found")}
							</span>
						</Match>
						<Match when={props.options.length === 0}>
							<span class="text-primary-contrast w-full block px-2.5 py-1 text-sm">
								{T("no_options_available")}
							</span>
						</Match>
					</Switch>
				</DropdownContent>
			</DropdownMenu.Root>
			<Form.DescribedBy
				id={props.id}
				describedBy={props.copy?.describedBy}
			/>
			<Form.ErrorMessage id={props.id} errors={props.errors} />
		</div>
	);
};
