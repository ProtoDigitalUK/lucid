import T from "@/translations/index";
import classNames from "classnames";
import { type Component, For, createMemo, Show, Switch, Match } from "solid-js";
import type { CFConfig, FieldResponse } from "@lucidcms/core/types";
import contentLocaleStore from "@/store/contentLocaleStore";
import brickStore from "@/store/brickStore";
import helpers from "@/utils/helpers";
import Builder from "@/components/Groups/Builder";
import Button from "@/components/Partials/Button";
import DragDrop from "@/components/Partials/DragDrop";

interface RepeaterFieldProps {
	state: {
		brickIndex: number;
		fieldConfig: CFConfig<"repeater">;
		fieldData?: FieldResponse;
		groupId?: number | string;
		parentRepeaterKey?: string;
		repeaterDepth: number;
	};
}

export const RepeaterField: Component<RepeaterFieldProps> = (props) => {
	// -------------------------------
	// Memos
	const contentLocales = createMemo(
		() => contentLocaleStore.get.locales.map((locale) => locale.code) || [],
	);
	const fieldConfig = createMemo(() => props.state.fieldConfig);
	const brickIndex = createMemo(() => props.state.brickIndex);
	const groups = createMemo(() => props.state.fieldData?.groups || []);
	const canAddGroup = createMemo(() => {
		if (!fieldConfig().validation?.maxGroups) return true;
		return groups().length < (fieldConfig().validation?.maxGroups || 0);
	});
	const dragDropKey = createMemo(() => {
		return `${fieldConfig().key}-${props.state.parentRepeaterKey || ""}-${
			props.state.groupId || ""
		}`;
	});

	// -------------------------------
	// Functions
	const addGroup = () => {
		if (!fieldConfig().fields) return;
		brickStore.get.addRepeaterGroup({
			brickIndex: brickIndex(),
			fieldConfig: fieldConfig().fields || [],
			key: fieldConfig().key,
			groupId: props.state.groupId,
			parentRepeaterKey: props.state.parentRepeaterKey,
			locales: contentLocales(),
		});
	};

	// -------------------------------
	// Render
	return (
		<div
			class={classNames("mb-2.5 last:mb-0 w-full", {
				"mt-5": props.state.repeaterDepth > 0,
			})}
		>
			<p
				class={
					"block text-sm transition-colors duration-200 ease-in-out mb-2"
				}
			>
				{helpers.getLocaleValue({
					value: fieldConfig().labels?.title,
				})}
			</p>
			{/* Repeater Body */}
			<Switch>
				<Match when={groups().length > 0}>
					<DragDrop
						sortOrder={(index, targetindex) => {
							brickStore.get.swapGroupOrder({
								brickIndex: props.state.brickIndex,
								repeaterKey: fieldConfig().key,
								selectedGroupId: index,
								targetGroupId: targetindex,

								groupId: props.state.groupId,
								parentRepeaterKey:
									props.state.parentRepeaterKey,
							});
						}}
					>
						{({ dragDrop }) => (
							<For each={groups()}>
								{(g, i) => (
									<Builder.GroupBody
										state={{
											brickIndex: brickIndex(),
											fieldConfig: fieldConfig(),
											dragDropKey: dragDropKey(),
											fields: g.fields,
											groupId: g.id,
											groupOpen: g.open,
											dragDrop: dragDrop,
											repeaterKey: fieldConfig().key,
											groupIndex: i(),
											repeaterDepth:
												props.state.repeaterDepth,
											parentRepeaterKey:
												props.state.parentRepeaterKey,
											parentGroupId: props.state.groupId,
										}}
									/>
								)}
							</For>
						)}
					</DragDrop>
				</Match>
				<Match when={groups().length === 0}>
					<div class="w-full border-border-input bg-container-4 border p-15 md:p-30 rounded-md flex items-center flex-col justify-center text-center">
						<span class="text-sm text-unfocused capitalize">
							{T()("no_entries")}
						</span>
					</div>
				</Match>
			</Switch>
			{/* Repeater Footer */}
			<div class="w-full flex justify-between items-center mt-15">
				<Button
					type="button"
					theme="secondary"
					size="x-small"
					onClick={addGroup}
					disabled={!canAddGroup() || fieldConfig().disabled}
				>
					{T()("add_entry")}
				</Button>
				<Show when={fieldConfig().validation?.maxGroups !== undefined}>
					<span
						class={classNames(
							"text-body text-sm font-body font-normal mr-[25px]",
							{
								"text-error-base": !canAddGroup(),
							},
						)}
					>
						{groups().length}
						{"/"}
						{fieldConfig().validation?.maxGroups}
					</span>
				</Show>
			</div>
		</div>
	);
};
