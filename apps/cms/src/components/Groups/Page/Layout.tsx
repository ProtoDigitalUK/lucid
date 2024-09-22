import type { Component, JSXElement } from "solid-js";

export const Layout: Component<{
	slots?: {
		topBar?: JSXElement;
		header?: JSXElement;
		footer?: JSXElement;
	};
	children: JSXElement;
}> = (props) => {
	return (
		<div class="flex flex-col min-h-[calc(100vh-15px)] border-t border-x border-border rounded-t-xl">
			{props.slots?.topBar}
			{props.slots?.header}
			<div class="flex flex-grow flex-col justify-between bg-container-3">
				{props.children}
			</div>
			{props.slots?.footer}
		</div>
	);
};
