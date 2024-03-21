import type { Component } from "solid-js";
import { FaSolidChevronRight } from "solid-icons/fa";
// Components
import { Collapsible } from "@kobalte/core";

interface JSONPreviewProps {
	title: string;
	json: Record<string, unknown>;
}

const JSONPreview: Component<JSONPreviewProps> = (props) => {
	// ----------------------------------
	// Render
	return (
		<Collapsible.Root class="bg-backgroundAccent rounded-md mb-30 last:mb-0">
			<Collapsible.Trigger class="w-full flex justify-between items-center p-15 text-title font-medium text-sm">
				<span>{props.title}</span>
				<FaSolidChevronRight class={"h-3 w-3"} />
			</Collapsible.Trigger>
			<Collapsible.Content class="p-15 bg-backgroundAccentH rounded-b-md overflow-scroll">
				<pre class="text-xs text-title">
					{JSON.stringify(props.json, null, 2)}
				</pre>
			</Collapsible.Content>
		</Collapsible.Root>
	);
};

export default JSONPreview;
