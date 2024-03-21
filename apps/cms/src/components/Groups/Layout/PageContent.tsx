import type { Component, JSXElement } from "solid-js";

interface PageLayoutContentProps {
	children: JSXElement;
}

export const PageContent: Component<PageLayoutContentProps> = (props) => {
	// ----------------------------------------
	// Render
	return <div class="p-15 md:p-30">{props.children}</div>;
};
