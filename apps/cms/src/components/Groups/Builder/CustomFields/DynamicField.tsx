import { type Component, For, Match, Switch, Show, createMemo } from "solid-js";
import classNames from "classnames";
import type { CustomField, FieldResponse } from "@protoheadless/core/types";
import contentLanguageStore from "@/store/contentLanguageStore";
import builderStore, {} from "@/store/builderStore";
// import CustomFields from "@/components/Groups/CustomFields";
import FieldTypeIcon from "@/components/Partials/FieldTypeIcon";

interface DynamicFieldProps {
	state: {
		field: CustomField;
		activeTab?: string;
	};
}

export const DynamicField: Component<DynamicFieldProps> = (props) => {
	// -------------------------------
	// Memos
	const contentLanguage = createMemo(
		() => contentLanguageStore.get.contentLanguage,
	);

	const fieldError = createMemo(() => {});

	// -------------------------------
	// Render
	return (
		<div class="w-full mb-2.5 last:mb-0 relative">
			<Show when={props.state.field.type !== "tab"}>
				<FieldTypeIcon type={props.state.field.type} />
			</Show>
			<div
				class={classNames("w-full h-full", {
					"pl-[38px]": props.state.field.type !== "tab",
				})}
			>
				<Switch fallback={props.state.field.type}>
					<Match when={props.state.field.type === "text"}>
						{props.state.field.type}
					</Match>
				</Switch>
			</div>
		</div>
	);
};
