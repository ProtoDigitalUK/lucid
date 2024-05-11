import T from "@/translations";
import { type Component, Show, type JSX, createMemo } from "solid-js";
import classnames from "classnames";
import spawnToast from "@/utils/spawn-toast";

interface ButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
	theme:
		| "primary"
		| "container-outline"
		| "danger"
		| "basic"
		| "secondary-toggle";
	size: "x-small" | "small" | "medium" | "large" | "icon" | "auto";
	children: JSX.Element;

	onClick?: () => void;
	type?: "button" | "submit" | "reset";
	classes?: string;
	loading?: boolean;
	disabled?: boolean;
	active?: boolean;
	permission?: boolean;
}

const Button: Component<ButtonProps> = (props) => {
	// ----------------------------------------
	// Memos
	const classes = createMemo(() => {
		return classnames(
			"flex items-center justify-center min-w-max text-center focus:outline-none focus:ring-1 duration-200 transition-colors rounded-md font-display relative disabled:cursor-not-allowed disabled:opacity-80 font-medium",
			{
				"bg-primary-base hover:bg-primary-hover text-primary-contrast fill-primary-contrast hover:fill-white ring-primary-base":
					props.theme === "primary",
				"bg-transparent border border-primary-base hover:bg-primary-hover fill-primary-contrast text-title hover:text-primary-contrast ring-primary-base":
					props.theme === "container-outline",
				"bg-error-base hover:bg-error-hover text-error-contrast ring-primary-base fill-error-contrast":
					props.theme === "danger",

				// Toggles
				"ring-primary-base": props.theme === "secondary-toggle",
				"bg-transparent text-body fill-body hover:bg-primary-hover hover:text-primary-contrast hover:fill-primary-contrast border-border border":
					props.theme === "secondary-toggle" && !props.active,
				"bg-primary-base text-primary-contrast fill-primary-contrast hover:bg-primary-hover border-primary-base border":
					props.theme === "secondary-toggle" && props.active,

				// Sizes
				"px-2.5 py-2 text-sm": props.size === "x-small",
				"px-5 py-2.5 h-10 text-base": props.size === "small",
				"px-5 py-3.5 text-base": props.size === "medium",
				"px-10 py-4 text-base": props.size === "large",
				"w-10 h-10 p-0 !min-w-[40px]": props.size === "icon",
				"p-1": props.size === "auto",
				"opacity-80 cursor-not-allowed": props.permission === false,
			},
		);
	});

	// ----------------------------------------
	// Functions
	const buttonOnClick = (e: MouseEvent) => {
		if (props.permission === false) {
			spawnToast({
				title: T("no_permission_toast_title"),
				message: T("no_permission_toast_message"),
				status: "warning",
			});
			e.preventDefault();
			e.stopPropagation();
			return;
		}

		props.onClick?.();
	};

	// ----------------------------------------
	// Render
	return (
		<button
			{...props}
			type={props.type}
			class={classnames(classes(), props.classes)}
			onClick={buttonOnClick}
			disabled={props.disabled || props.loading}
		>
			<Show when={props.loading !== undefined && props.loading}>
				<div
					class={
						"flex items-center justify-center absolute inset-0 z-10 rounded-md bg-primary-base bg-opacity-40"
					}
				>
					<div class="w-4 h-4 border-2 border-white rounded-full animate-spin" />
				</div>
			</Show>
			{props.children}
		</button>
	);
};

export default Button;
