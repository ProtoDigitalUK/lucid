import T from "@/translations/index";
import classNames from "classnames";
import { type Component, For, createMemo, Show, Switch, Match } from "solid-js";
import { FaSolidGripLines, FaSolidTrashCan } from "solid-icons/fa";
// Types
import type { CustomField } from "@protoheadless/core/types";
// Store
import contentLanguageStore from "@/store/contentLanguageStore";
import builderStore, { type BrickStoreGroupT } from "@/store/builderStore";
// Components
import CustomFields from "@/components/Groups/CustomFields";
import Button from "@/components/Partials/Button";
import DragDrop from "@/components/Partials/DragDrop";

interface RepeaterFieldProps {
	state: {
		brickIndex: number;
		field: CustomField;
		repeater: {
			parentGroupId: BrickStoreGroupT["parent_group_id"];
			repeaterDepth: number;
		};
	};
}

export const RepeaterField: Component<RepeaterFieldProps> = (props) => {
	// -------------------------------
	// Memos
	const contentLanguage = createMemo(
		() => contentLanguageStore.get.contentLanguage,
	);

	const repeaterGroups = createMemo(() => {
		const groups = builderStore.get.bricks[props.state.brickIndex].groups;

		return groups
			.filter((group) => {
				return (
					group.repeater_key === props.state.field.key &&
					group.parent_group_id ===
						props.state.repeater.parentGroupId &&
					group.language_id === contentLanguage()
				);
			})
			.sort((a, b) => a.group_order - b.group_order);
	});

	const repeaterKey = createMemo(() => {
		return `${props.state.field.key}-${props.state.repeater.repeaterDepth}-${props.state.repeater.parentGroupId}`;
	});

	const canAddGroup = createMemo(() => {
		if (!props.state.field.validation?.maxGroups) return true;
		return (
			repeaterGroups().length < props.state.field.validation?.maxGroups
		);
	});

	// -------------------------------
	// Functions
	const nextOrder = () => {
		const repGroups = repeaterGroups();
		if (!repGroups.length) return 0;
		const largestOrder = repGroups.reduce((prev, current) => {
			return prev.group_order > current.group_order ? prev : current;
		});
		return largestOrder.group_order + 1;
	};
	const addGroup = () => {
		if (!props.state.field.fields) return;
		builderStore.get.addGroup({
			brickIndex: props.state.brickIndex,
			fields: props.state.field.fields,

			repeaterKey: props.state.field.key,
			parentGroupId: props.state.repeater.parentGroupId || null,
			order: nextOrder(),
			contentLanguage: contentLanguage(),
		});
	};
	const removeGroup = (group_id: BrickStoreGroupT["group_id"]) => {
		builderStore.get.removeGroup({
			brickIndex: props.state.brickIndex,
			groupId: group_id,
		});
	};

	// -------------------------------
	// Render
	return (
		<div class="mb-2.5 last:mb-0 w-full">
			<h3 class="text-sm text-body font-body font-normal mb-2.5">
				{props.state.field.title}
			</h3>
			{/* Group */}
			<Switch>
				<Match when={repeaterGroups().length > 0}>
					<DragDrop
						sortOrder={(index, targetindex) => {
							builderStore.get.swapGroupOrder({
								brickIndex: props.state.brickIndex,

								groupId: index,
								targetGroupId: targetindex,
							});
						}}
					>
						{({ dragDrop }) => (
							<For each={repeaterGroups()}>
								{(group) => (
									<div
										class={classNames("w-full flex", {
											"opacity-60":
												dragDrop.getDragging()
													?.index === group.group_id,
										})}
										data-dragkey={repeaterKey()}
										onDragStart={(e) =>
											dragDrop.onDragStart(e, {
												index: group.group_id,
												key: repeaterKey(),
											})
										}
										onDragEnd={(e) => dragDrop.onDragEnd(e)}
										onDragEnter={(e) =>
											dragDrop.onDragEnter(e, {
												index: group.group_id,
												key: repeaterKey(),
											})
										}
										onDragOver={(e) =>
											dragDrop.onDragOver(e)
										}
									>
										{/* Group Items */}
										<div
											class={classNames(
												"bg-container-2 border-border border mb-2.5 flex last:mb-0 rounded-md w-full duration-200 transition-colors",
												{
													"bg-container-1":
														props.state.repeater
															.repeaterDepth %
															2 !==
														0,
													"border-primary-base":
														dragDrop.getDraggingTarget()
															?.index ===
														group.group_id,
												},
											)}
										>
											<div
												class="w-5 h-full bg-container-4 hover:bg-container-3 transition-colors duration-200 flex items-center justify-center cursor-grab"
												onDragStart={(e) =>
													dragDrop.onDragStart(e, {
														index: group.group_id,
														key: repeaterKey(),
													})
												}
												onDragEnd={(e) =>
													dragDrop.onDragEnd(e)
												}
												onDragEnter={(e) =>
													dragDrop.onDragEnter(e, {
														index: group.group_id,
														key: repeaterKey(),
													})
												}
												onDragOver={(e) =>
													dragDrop.onDragOver(e)
												}
												draggable={true}
											>
												<FaSolidGripLines class="text-title w-3" />
											</div>
											<div class="p-15 w-full">
												<For
													each={
														props.state.field.fields
													}
												>
													{(field) => (
														<CustomFields.DynamicField
															state={{
																brickIndex:
																	props.state
																		.brickIndex,
																field: field,
																groupId:
																	group.group_id,

																repeater: {
																	parentGroupId:
																		group.group_id,
																	repeaterDepth:
																		(props
																			.state
																			.repeater
																			.repeaterDepth ||
																			0) +
																		1,
																},
															}}
														/>
													)}
												</For>
											</div>
										</div>
										{/* Group Action Bar */}
										<div
											class={
												"ml-2.5 transition-opacity duration-200"
											}
										>
											<button
												type="button"
												class="text-icon-base hover:fill-error-hover bg-transparent transition-colors duration-200 cursor-pointer"
												onClick={() => {
													removeGroup(group.group_id);
												}}
												aria-label={T("remove_entry")}
											>
												<FaSolidTrashCan class="w-4" />
											</button>
										</div>
									</div>
								)}
							</For>
						)}
					</DragDrop>
				</Match>
				<Match when={repeaterGroups().length === 0}>
					<div class="w-full border-border border p-15 md:p-30 mb-15 rounded-md bg-container-1 flex items-center flex-col justify-center text-center">
						<span class="text-sm text-unfocused">
							{T("no_entries")}
						</span>
					</div>
				</Match>
			</Switch>
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
								"text-error-base": !canAddGroup(),
							},
						)}
					>
						{repeaterGroups().length}
						{"/"}
						{props.state.field.validation?.maxGroups}
					</span>
				</Show>
			</div>
		</div>
	);
};
