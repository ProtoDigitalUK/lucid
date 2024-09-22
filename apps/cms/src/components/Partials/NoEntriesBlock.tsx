import T from "@/translations";
import { Show, type Component } from "solid-js";
import Button from "@/components/Partials/Button";

interface NoEntriesBlockProps {
	copy: {
		title?: string;
		description?: string;
		button?: string;
	};
	callbacks?: {
		action?: () => void;
	};
}

const NoEntriesBlock: Component<NoEntriesBlockProps> = (props) => {
	// ----------------------------------
	// Render
	return (
		<div class={"flex items-center justify-center"}>
			<div class="text-center flex flex-col items-center">
				<h2 class="mb-15">
					{props.copy?.title || T()("no_entries_title")}
				</h2>
				<p class="max-w-96">
					{props.copy?.description || T()("no_entries_description")}
				</p>
				<Show when={props.callbacks?.action !== undefined}>
					<Button
						theme={"primary"}
						size="medium"
						classes="mt-30"
						onClick={props.callbacks?.action}
					>
						{props.copy?.button || T()("create_entry")}
					</Button>
				</Show>
			</div>
		</div>
	);
};

export default NoEntriesBlock;
