import T from "@/translations/index";
import classNames from "classnames";
import {
	type Component,
	type Accessor,
	type Setter,
	For,
	createMemo,
	Show,
	Switch,
	Match,
} from "solid-js";
import type { CustomField } from "@protoheadless/core/types";
import contentLanguageStore from "@/store/contentLanguageStore";
import brickStore from "@/store/brickStore";
import brickHelpers from "@/utils/brick-helpers";
import Builder from "@/components/Groups/Builder";
import Button from "@/components/Partials/Button";

interface RepeaterFieldProps {
	state: {
		brickIndex: number;
		field: CustomField;
		groupId?: number | string;
		getFieldPath: Accessor<string[]>;
		setFieldPath: Setter<string[]>;
		getGroupPath: Accessor<Array<string | number>>;
		setGroupPath: Setter<Array<string | number>>;
	};
}

export const RepeaterField: Component<RepeaterFieldProps> = (props) => {
	// -------------------------------
	// Memos
	const fieldData = createMemo(() =>
		brickHelpers.getBrickField({
			brickIndex: props.state.brickIndex,
			fieldPath: props.state.getFieldPath(),
			groupPath: props.state.getGroupPath(),
		}),
	);
	const canAddGroup = createMemo(() => {
		if (!props.state.field.validation?.maxGroups) return true;
		const groupCount = fieldData()?.groups?.length ?? 0;
		return groupCount < props.state.field.validation?.maxGroups;
	});
	const contentLanguage = createMemo(
		() => contentLanguageStore.get.contentLanguage,
	);

	// -------------------------------
	// Functions
	const addGroup = () => {
		if (!props.state.field.fields) return;

		brickStore.get.addRepeaterGroup({
			brickIndex: props.state.brickIndex,
			fieldPath: props.state.getFieldPath(),
			groupPath: props.state.getGroupPath(),
			fields: props.state.field.fields,
			contentLanguage: contentLanguage(),
		});
	};

	// -------------------------------
	// Render
	if (fieldData() === undefined) return null;

	return (
		<div class="mb-2.5 last:mb-0 w-full">
			<h3 class="text-sm text-body font-body font-normal mb-2.5">
				{props.state.field.title}
			</h3>
			{/* Repeater Body */}
			<Switch>
				<Match when={(fieldData()?.groups?.length ?? 0) > 0}>
					<For each={fieldData()?.groups}>
						{(group) => (
							<Builder.GroupBody
								state={{
									brickIndex: props.state.brickIndex,
									field: props.state.field,
									groupId: group.id,
									getFieldPath: props.state.getFieldPath,
									setFieldPath: props.state.setFieldPath,
									getGroupPath: props.state.getGroupPath,
									setGroupPath: props.state.setGroupPath,
								}}
							/>
						)}
					</For>
				</Match>
				<Match when={(fieldData()?.groups?.length ?? 0) === 0}>
					<div class="w-full border-border border p-15 md:p-30 mb-15 rounded-md bg-container flex items-center flex-col justify-center text-center">
						<span class="text-sm text-unfocused">
							{T("no_entries")}
						</span>
					</div>
				</Match>
			</Switch>
			{/* Repeater Footer */}
			<div class="w-full flex justify-between items-center">
				<Button
					type="button"
					theme="container-outline"
					size="x-small"
					onClick={addGroup}
					disabled={!canAddGroup()}
				>
					{T("add_entry")}
				</Button>
				<Show
					when={props.state.field.validation?.maxGroups !== undefined}
				>
					<span
						class={classNames(
							"text-body text-sm font-body font-normal mr-[25px]",
							{
								"text-error": !canAddGroup(),
							},
						)}
					>
						{fieldData()?.groups?.length ?? 0}
						{"/"}
						{props.state.field.validation?.maxGroups}
					</span>
				</Show>
			</div>
		</div>
	);
};
