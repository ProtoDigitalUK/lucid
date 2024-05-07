import { type Component, Show, createSignal, createMemo } from "solid-js";
import classnames from "classnames";
import { FaSolidEye, FaSolidEyeSlash } from "solid-icons/fa";
// Types
import type {
	ErrorResult,
	ErrorResultObj,
	FieldErrors,
} from "@lucidcms/core/types";
// Components
import Form from "@/components/Groups/Form";

interface InputProps {
	id: string;
	value: string;
	onChange: (_value: string) => void;
	type: string;
	name: string;
	copy?: {
		label?: string;
		placeholder?: string;
		describedBy?: string;
		tooltip?: string;
	};
	onBlur?: () => void;
	autoFoucs?: boolean;
	onKeyUp?: (_e: KeyboardEvent) => void;
	autoComplete?: string;
	required?: boolean;
	disabled?: boolean;
	errors?: ErrorResult | FieldErrors;
	noMargin?: boolean;

	theme?: "basic";
}

export const Input: Component<InputProps> = (props) => {
	const [inputFocus, setInputFocus] = createSignal(false);
	const [passwordVisible, setPasswordVisible] = createSignal(false);

	// ----------------------------------------
	// Memos
	const inputType = createMemo(() => {
		if (props.type === "password" && passwordVisible()) return "text";
		return props.type;
	});

	// ----------------------------------------
	// Render
	return (
		<div
			class={classnames("w-full", {
				"mb-0": props.noMargin,
				"mb-15 last:mb-0": !props.noMargin && props.theme !== "basic",
				"mb-2.5 last:mb-0": !props.noMargin && props.theme === "basic",
			})}
		>
			<div
				class={classnames(
					"flex flex-col transition-colors duration-200 ease-in-out relative",
					{
						"border-primary-base bg-container-3":
							inputFocus() && props.theme !== "basic",
						"border-error-base":
							props.errors?.message !== undefined,
						"bg-container-4 rounded-md border border-border":
							props.theme !== "basic",
					},
				)}
			>
				<Form.Label
					id={props.id}
					label={props.copy?.label}
					focused={inputFocus()}
					required={props.required}
					theme={props.theme}
				/>
				<input
					class={classnames(
						"focus:outline-none px-2.5 text-sm text-title font-medium disabled:cursor-not-allowed disabled:opacity-80",
						{
							"pr-[38px]": props.type === "password",
							"pt-2": props.copy?.label === undefined,
							"bg-container-4 border border-border h-10 rounded-md mt-1 focus:border-primary-base duration-200 transition-colors":
								props.theme === "basic",
							"bg-transparent pb-2 pt-1 rounded-b-md":
								props.theme !== "basic",
						},
					)}
					onKeyDown={(e) => {
						e.stopPropagation();
					}}
					id={props.id}
					name={props.name}
					type={inputType()}
					value={props.value}
					onInput={(e) => props.onChange(e.currentTarget.value)}
					placeholder={props.copy?.placeholder}
					aria-describedby={
						props.copy?.describedBy
							? `${props.id}-description`
							: undefined
					}
					autocomplete={props.autoComplete}
					autofocus={props.autoFoucs}
					required={props.required}
					disabled={props.disabled}
					onFocus={() => setInputFocus(true)}
					onKeyUp={(e) => props.onKeyUp?.(e)}
					onBlur={() => {
						setInputFocus(false);
						props.onBlur?.();
					}}
				/>
				{/* Show Password */}
				<Show when={props.type === "password"}>
					<button
						type="button"
						class="absolute right-2.5 top-1/2 -translate-y-1/2 text-primary-hover hover:text-primary-base duration-200 transition-colors"
						onClick={() => {
							setPasswordVisible(!passwordVisible());
						}}
					>
						<Show when={passwordVisible()}>
							<FaSolidEyeSlash size={18} class="text-unfocused" />
						</Show>
						<Show when={!passwordVisible()}>
							<FaSolidEye size={18} class="text-unfocused" />
						</Show>
					</button>
				</Show>
				<Form.Tooltip copy={props.copy?.tooltip} theme={props.theme} />
			</div>
			<Form.DescribedBy
				id={props.id}
				describedBy={props.copy?.describedBy}
			/>
			<Form.ErrorMessage id={props.id} errors={props.errors} />
		</div>
	);
};
