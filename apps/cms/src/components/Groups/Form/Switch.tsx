import T from "@/translations";
import { type Component, createSignal } from "solid-js";
import classnames from "classnames";
import type { ErrorResult, FieldErrors } from "@lucidcms/core/types";
import Form from "@/components/Groups/Form";

interface SwitchProps {
	id: string;
	value: boolean;
	onChange: (_value: boolean) => void;
	name?: string;
	copy: {
		label?: string;
		describedBy?: string;
		true?: string;
		false?: string;
		tooltip?: string;
	};
	disabled?: boolean;
	required?: boolean;
	errors?: ErrorResult | FieldErrors;
	altLocaleError?: boolean;
	noMargin?: boolean;
}

export const Switch: Component<SwitchProps> = (props) => {
	let checkboxRef: HTMLInputElement | undefined;
	const [inputFocus, setInputFocus] = createSignal(false);

	// ----------------------------------------
	// Render
	return (
		<div
			class={classnames("w-full relative", {
				"mb-0": props.noMargin,
				"mb-15 last:mb-0": !props.noMargin,
			})}
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
				ref={checkboxRef}
				type="checkbox"
				id={props.id}
				name={props.name}
				checked={props.value}
				onChange={(e) => {
					props.onChange(e.currentTarget.checked);
				}}
				class="hidden"
				disabled={props.disabled}
			/>
			<button
				type="button"
				class="bg-container-4 disabled:cursor-not-allowed disabled:opacity-50 rounded-md flex border border-border mt-1 relative h-10 focus:border-primary-base focus:outline-none focus:ring-1 ring-inset ring-primary-base group"
				onClick={() => {
					checkboxRef?.click();
				}}
				onFocus={() => {
					setInputFocus(true);
				}}
				onBlur={() => {
					setInputFocus(false);
				}}
				disabled={props.disabled}
			>
				<span
					class={classnames(
						"w-1/2 px-15 py-1 flex items-center text-center z-10 relative duration-200 transition-colors text-sm h-full",
						{
							"text-primary-contrast": !props.value,
							"text-title": props.value,
						},
					)}
				>
					{props.copy?.false || T()("false")}
				</span>
				<span
					class={classnames(
						"w-1/2 px-15 py-1 flex items-center text-center z-10 relative duration-200 transition-colors text-sm h-full",
						{
							"text-primary-contrast": props.value,
							"text-title": !props.value,
						},
					)}
				>
					{props.copy?.true || T()("true")}
				</span>
				<span
					class={classnames(
						"w-1/2 bg-primary-base absolute top-0 bottom-0 transition-all duration-200 rounded-md z-0 group-hover:bg-primary-hover",
						{
							"left-1/2": props.value,
							"left-0": !props.value,
						},
					)}
				/>
			</button>
			<Form.DescribedBy
				id={props.id}
				describedBy={props.copy?.describedBy}
			/>
			<Form.Tooltip copy={props.copy?.tooltip} theme={undefined} />
			<Form.ErrorMessage id={props.id} errors={props.errors} />
		</div>
	);
};
