import { type Component, type JSXElement, Switch, Match } from "solid-js";

export const Dynamic: Component<{
	state?: {
		isError?: boolean;
		isSuccess?: boolean;
		isEmpty?: boolean;
		isLoading?: boolean;
	};
	slot?: {
		/** The footer slot - can be used instead of the Layout footer slot if the footer needs state from the content. */
		footer?: JSXElement;
	};
	children: JSXElement;
}> = (props) => {
	// ----------------------------------------
	// Render
	return (
		<>
			<Switch fallback={props.children}>
				<Match when={props.state?.isError}>error</Match>
				<Match when={props.state?.isEmpty}>empty</Match>
				<Match when={props.state?.isLoading}>loading</Match>
				<Match when={props.state?.isSuccess}>{props.children}</Match>
			</Switch>
			{props.slot?.footer}
		</>
	);
};
