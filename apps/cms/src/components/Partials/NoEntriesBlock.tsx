import T from "@/translations";
import { Show, type Component } from "solid-js";
import classNames from "classnames";
import Button from "@/components/Partials/Button";

interface NoEntriesBlockProps {
	type: "page-layout" | "block-grow";
	copy: {
		title?: string;
		description?: string;
		button?: string;
	};
	action?: () => void;
}

const NoEntriesBlock: Component<NoEntriesBlockProps> = (props) => {
	// ----------------------------------
	// Render
	return (
		<div
			class={classNames(
				"flex items-center justify-center bg-container-3 border-t border-border ",
				{
					"page-layout-full-body": props.type === "page-layout",
					"flex-grow": props.type === "block-grow",
				},
			)}
		>
			<div class="text-center flex flex-col items-center">
				<h2 class="mb-15">
					{props.copy?.title || T()("no_entries_title")}
				</h2>
				<p class="max-w-96">
					{props.copy?.description || T()("no_entries_description")}
				</p>
				<Show when={props.action !== undefined}>
					<Button
						theme={"primary"}
						size="medium"
						classes="mt-30"
						onClick={props.action}
					>
						{props.copy?.button || T()("create_entry")}
					</Button>
				</Show>
			</div>
		</div>
	);
};

export default NoEntriesBlock;
