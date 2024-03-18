import { Component, JSXElement, Show, createMemo } from "solid-js";
import { useNavigate } from "@solidjs/router";
// Types
import { TableRowProps } from "@/types/components";
// Components
import SelectCol from "@/components/Tables/Columns/SelectCol";
import ActionMenuCol from "@/components/Tables/Columns/ActionMenuCol";
import { ActionDropdownProps } from "@/components/Partials/ActionDropdown";
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
	// Render
	return (
		<tr
			class={classNames(
				"bg-background hover:bg-backgroundAccent duration-200 transition-colors",
				{
					"cursor-pointer": firstPermittedAction() !== undefined,
				},
			)}
			onClick={() => {
				const action = firstPermittedAction();

				if (action) {
					if (action?.href) {
						navigate(action.href);
					} else if (action.onClick) {
						action.onClick();
					}
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
