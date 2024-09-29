import { type Component, createSignal, For, Show } from "solid-js";
import classnames from "classnames";
import type { ErrorResult, FieldErrors } from "@lucidcms/core/types";
import Form from "@/components/Groups/Form";

interface ColourProps {
	id: string;
	value: string;
	onChange: (_value: string) => void;
	name: string;
	copy?: {
		label?: string;
		describedBy?: string;
	};
	presets?: string[];
	required?: boolean;
	disabled?: boolean;
	errors?: ErrorResult | FieldErrors;
	altLocaleError?: boolean;
}

export const Colour: Component<ColourProps> = (props) => {
	const [inputFocus, setInputFocus] = createSignal(false);

	// ----------------------------------------
	// Render
	return (
		<div
			class={classnames(
				"mb-2.5 last:mb-0 flex flex-col transition-colors duration-200 ease-in-out relative w-full",
			)}
		>
			<Form.Label
				id={props.id}
				label={props.copy?.label}
				focused={inputFocus()}
				required={props.required}
				theme={"basic"}
				altLocaleError={props.altLocaleError}
			/>
			<input
				class={classnames(
					"focus:outline-none disabled:cursor-not-allowed disabled:opacity-80 text-sm text-title font-medium p-1 bg-container-4 border border-border-input h-10 w-full rounded-md mt-1 focus:border-primary-base duration-200 transition-colors",
				)}
				onKeyDown={(e) => {
					e.stopPropagation();
				}}
				id={props.id}
				name={props.name}
				type={"color"}
				value={props.value}
				onInput={(e) => props.onChange(e.currentTarget.value)}
				aria-describedby={
					props.copy?.describedBy ? `${props.id}-description` : undefined
				}
				required={props.required}
				disabled={props.disabled}
				onFocus={() => setInputFocus(true)}
				onBlur={() => {
					setInputFocus(false);
				}}
			/>
			<Show when={props.presets !== undefined}>
				<ul class="mt-2.5">
					<For each={props.presets}>
						{(preset) => (
							<li class="inline-block">
								<button
									class="focus:outline-none focus:ring-1 focus:ring-primary-base focus:ring-opacity-50 rounded-md h-6 w-6 mr-1 border border-border"
									style={{
										"background-color": preset,
									}}
									onClick={() => props.onChange(preset)}
									type="button"
								/>
								<span class="sr-only">{preset}</span>
							</li>
						)}
					</For>
				</ul>
			</Show>
			<Form.DescribedBy id={props.id} describedBy={props.copy?.describedBy} />
			<Form.ErrorMessage id={props.id} errors={props.errors} />
		</div>
	);
};
