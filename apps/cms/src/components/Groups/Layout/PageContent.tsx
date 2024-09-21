import type { Component, JSXElement } from "solid-js";
import classNames from "classnames";

interface PageLayoutContentProps {
	children: JSXElement;
	options?: {
		border?: boolean;
	};
}

export const PageContent: Component<PageLayoutContentProps> = (props) => {
	// ----------------------------------------
	// Render
	return (
		<div
			class={classNames("p-15 md:p-30", {
				"border-t border-border": props.options?.border,
			})}
		>
			{props.children}
		</div>
	);
};
