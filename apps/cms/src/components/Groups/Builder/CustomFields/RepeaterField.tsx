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
import type { CustomField } from "@lucidcms/core/types";
import contentLanguageStore from "@/store/contentLanguageStore";
import brickStore from "@/store/brickStore";
import brickHelpers from "@/utils/brick-helpers";
import Builder from "@/components/Groups/Builder";
import Button from "@/components/Partials/Button";
import DragDrop from "@/components/Partials/DragDrop";

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
	const contentLanguage = createMemo(
		() => contentLanguageStore.get.contentLanguage,
	);
	const field = createMemo(() => props.state.field);
	const brickIndex = createMemo(() => props.state.brickIndex);
	const fieldData = createMemo(() =>
		brickHelpers.getBrickField({
			brickIndex: brickIndex(),
			fieldPath: props.state.getFieldPath(),
			groupPath: props.state.getGroupPath(),
			field: field(),
			contentLanguage: contentLanguage(),
		}),
	);
	const fieldGroupIds = createMemo(() => {
		const groupOrder = fieldData()
			?.groups?.map((g) => {
				return {
					id: g.id,
					order: g.order,
				};
			})
			.sort((a, b) => a.order - b.order);

		return groupOrder?.map((g) => g.id) || [];
	});
	const canAddGroup = createMemo(() => {
		if (!field().validation?.maxGroups) return true;
		return fieldGroupIds().length < (field().validation?.maxGroups || 0);
	});
	const repeaterKey = createMemo(() => {
		return `${props.state.field.key}-${
			props.state.getGroupPath().length
		}-${props.state.getGroupPath().join("-")}`;
	});

	// -------------------------------
	// Functions
	const addGroup = () => {
		if (!field().fields) return;

		brickStore.get.addRepeaterGroup({
			brickIndex: brickIndex(),
			fieldPath: props.state.getFieldPath(),
			groupPath: props.state.getGroupPath(),
			fields: field().fields || [],
			contentLanguage: contentLanguage(),
		});
	};

	// -------------------------------
	// Render
	if (fieldData() === undefined) return null;

	return (
		<div
			class={classNames("mb-2.5 last:mb-0 w-full", {
				"mt-5": props.state.getGroupPath().length > 0,
			})}
		>
			{/* Repeater Body */}
			<Switch>
				<Match when={fieldGroupIds().length > 0}>
					<DragDrop
						sortOrder={(index, targetindex) => {
							brickStore.get.swapGroupOrder({
								brickIndex: props.state.brickIndex,
								fieldPath: props.state.getFieldPath(),
								groupPath: props.state.getGroupPath(),
								groupId: index,
								targetGroupId: targetindex,
							});
						}}
					>
						{({ dragDrop }) => (
							<For each={fieldGroupIds()}>
								{(groupId, i) => (
									<Builder.GroupBody
										state={{
											brickIndex: brickIndex(),
											field: field(),
											groupId: groupId,
											dragDrop: dragDrop,
											repeaterKey: repeaterKey(),
											groupIndex: i(),
											getFieldPath:
												props.state.getFieldPath,
											setFieldPath:
												props.state.setFieldPath,
											getGroupPath:
												props.state.getGroupPath,
											setGroupPath:
												props.state.setGroupPath,
										}}
									/>
								)}
							</For>
						)}
					</DragDrop>
				</Match>
				<Match when={fieldGroupIds().length === 0}>
					<div class="w-full border-border border p-15 md:p-30 mb-15 rounded-md flex items-center flex-col justify-center text-center">
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
				<Show when={field().validation?.maxGroups !== undefined}>
					<span
						class={classNames(
							"text-body text-sm font-body font-normal mr-[25px]",
							{
								"text-error-base": !canAddGroup(),
							},
						)}
					>
						{fieldGroupIds().length}
						{"/"}
						{field().validation?.maxGroups}
					</span>
				</Show>
			</div>
		</div>
	);
};
