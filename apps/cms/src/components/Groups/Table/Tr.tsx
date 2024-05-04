import { type Component, type JSXElement, Show, createMemo } from "solid-js";
import { useNavigate } from "@solidjs/router";
// Types
import type { TableRowProps } from "@/types/components";
// Components
import SelectCol from "@/components/Tables/Columns/SelectCol";
import ActionMenuCol from "@/components/Tables/Columns/ActionMenuCol";
import type { ActionDropdownProps } from "@/components/Partials/ActionDropdown";
import classNames from "classnames";

interface TrProps extends TableRowProps {
	actions?: ActionDropdownProps["actions"];
	children: JSXElement;
}

// Table Row

export const Tr: Component<TrProps> = (props) => {
	// ----------------------------------------
	// State / Hooks
	const navigate = useNavigate();

	// ----------------------------------------
	// Memos
	const firstPermittedAction = createMemo(() => {
		if (props.actions) {
			return props.actions.find((action) => {
				return action.permission !== false;
			});
		}
	});

	// ----------------------------------------
	// Functions
	const onClickHandler = () => {
		const action = firstPermittedAction();

		if (action) {
			if (action?.href) {
				navigate(action.href);
			} else if (action.onClick) {
				action.onClick();
			}
		}
	};

	// ----------------------------------------
	// Render
	return (
		<tr
			class={classNames(
				"bg-container-3 hover:bg-container-4 duration-200 transition-colors",
				{
					"cursor-pointer": firstPermittedAction() !== undefined,
				},
			)}
			onClick={onClickHandler}
			onKeyDown={(e) => {
				if (e.key === "Enter") {
					onClickHandler();
				}
			}}
		>
			<Show when={props.options?.isSelectable}>
				<SelectCol
					type={"td"}
					value={props?.selected || false}
					onChange={() => {
						if (
							props.callbacks?.setSelected &&
							props?.index !== undefined
						) {
							props.callbacks.setSelected(props?.index);
						}
					}}
				/>
			</Show>
			{props.children}
			<ActionMenuCol actions={props.actions || []} />
		</tr>
	);
};
