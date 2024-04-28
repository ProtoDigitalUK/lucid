import classNames from "classnames";
import type { Component } from "solid-js";
import Spinner from "@/components/Partials/Spinner";

interface LoadingProps {
	type: "fill" | "page-layout";
}

const Loading: Component<LoadingProps> = (props) => {
	return (
		<div
			class={classNames("flex items-center justify-center", {
				"page-layout-full-body": props.type === "page-layout",
				"inset-0 absolute z-50": props.type === "fill",
			})}
		>
			<Spinner size="md" />
		</div>
	);
};

export default Loading;
