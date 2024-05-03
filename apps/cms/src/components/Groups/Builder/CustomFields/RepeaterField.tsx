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
import { FaSolidGripLines, FaSolidTrashCan } from "solid-icons/fa";
import type { CustomField } from "@protoheadless/core/types";
import brickHelpers from "@/utils/brick-helpers";
import CustomFields from "@/components/Groups/Builder/CustomFields";
import Button from "@/components/Partials/Button";

interface RepeaterFieldProps {
	state: {
		brickIndex: number;
		field: CustomField;
		groupIndex?: number;
		getFieldPath: Accessor<string[]>;
		setFieldPath: Setter<string[]>;
		getGroupIndexes: Accessor<number[]>;
		setGroupIndexes: Setter<number[]>;
	};
}

export const RepeaterField: Component<RepeaterFieldProps> = (props) => {
	// -------------------------------
	// Memos
	const fieldData = createMemo(() =>
		brickHelpers.getBrickField({
			brickIndex: props.state.brickIndex,
			fieldPath: props.state.getFieldPath(),
			groupIndexes: props.state.getGroupIndexes(),
		}),
	);
	const canAddGroup = createMemo(() => {
		return true; // TODO: Implement this
	});

	// -------------------------------
	// Functions
	const addGroup = () => {};
	const removeGroup = (groupIndex: number) => {};

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
						{(_, groupIndex) => (
							<div class={classNames("w-full flex", {})}>
								{/* Group Items */}
								<div
									class={classNames(
										"bg-background border-border border mb-2.5 flex last:mb-0 rounded-md w-full duration-200 transition-colors",
										{
											"bg-white":
												props.state.getGroupIndexes()
													.length %
													2 !==
												0,
										},
									)}
								>
									<div class="w-5 h-full bg-backgroundAccent hover:bg-backgroundAccentH transition-colors duration-200 flex items-center justify-center cursor-grab">
										<FaSolidGripLines class="fill-title w-3" />
									</div>
									<div class="p-15 w-full">
										<For each={props.state.field.fields}>
											{(field) => (
												<CustomFields.DynamicField
													state={{
														brickIndex:
															props.state
																.brickIndex,
														field: field,
														groupIndex:
															groupIndex(),
														getFieldPath:
															props.state
																.getFieldPath,
														setFieldPath:
															props.state
																.setFieldPath,
														getGroupIndexes:
															props.state
																.getGroupIndexes,
														setGroupIndexes:
															props.state
																.setGroupIndexes,
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
										class="fill-primary hover:fill-errorH bg-transparent transition-colors duration-200 cursor-pointer"
										onClick={() => {
											removeGroup(groupIndex());
										}}
										aria-label={T("remove_entry")}
									>
										<FaSolidTrashCan class="w-4" />
									</button>
								</div>
							</div>
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
						{fieldData()?.groups?.length}
						{"/"}
						{props.state.field.validation?.maxGroups}
					</span>
				</Show>
			</div>
		</div>
	);
};
