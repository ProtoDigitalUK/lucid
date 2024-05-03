import {
	type Component,
	Match,
	Switch,
	Show,
	createMemo,
	createSignal,
	type Accessor,
	type Setter,
} from "solid-js";
import classNames from "classnames";
import type { CustomField } from "@protoheadless/core/types";
import CustomFields from "@/components/Groups/Builder/CustomFields";
import FieldTypeIcon from "@/components/Partials/FieldTypeIcon";

interface DynamicFieldProps {
	state: {
		brickIndex: number;
		field: CustomField;
		activeTab?: string;
		groupIndex?: number;
		getFieldPath?: Accessor<string[]>;
		setFieldPath?: Setter<string[]>;
		getGroupIndexes?: Accessor<number[]>;
		setGroupIndexes?: Setter<number[]>;
	};
}

export const DynamicField: Component<DynamicFieldProps> = (props) => {
	// -------------------------------
	// State
	const [getFieldPath, setFieldPath] = createSignal<string[]>(
		props.state.getFieldPath?.() || [],
	);
	const [getGroupIndexes, setGroupIndexes] = createSignal<number[]>(
		props.state.getGroupIndexes?.() || [],
	);

	// -------------------------------
	// Memos
	const fieldError = createMemo(() => {});

	setFieldPath((prev) => [...prev, props.state.field.key]);
	setGroupIndexes((prev) => {
		if (props.state.groupIndex === undefined) return prev;
		return [...prev, props.state.groupIndex];
	});

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
				<Switch
					fallback={
						<>
							({props.state.field.key} -{" "}
							{props.state.field.repeaterKey})
						</>
					}
				>
					<Match when={props.state.field.type === "text"}>
						<CustomFields.InputField
							type="text"
							state={{
								brickIndex: props.state.brickIndex,
								field: props.state.field,
								groupIndex: props.state.groupIndex,
								getFieldPath: getFieldPath,
								getGroupIndexes: getGroupIndexes,
							}}
						/>
					</Match>
					<Match when={props.state.field.type === "number"}>
						<CustomFields.InputField
							type="number"
							state={{
								brickIndex: props.state.brickIndex,
								field: props.state.field,
								groupIndex: props.state.groupIndex,
								getFieldPath: getFieldPath,
								getGroupIndexes: getGroupIndexes,
							}}
						/>
					</Match>
					<Match when={props.state.field.type === "datetime"}>
						<CustomFields.InputField
							type="datetime-local"
							state={{
								brickIndex: props.state.brickIndex,
								field: props.state.field,
								groupIndex: props.state.groupIndex,
								getFieldPath: getFieldPath,
								getGroupIndexes: getGroupIndexes,
							}}
						/>
					</Match>
					<Match when={props.state.field.type === "repeater"}>
						<CustomFields.RepeaterField
							state={{
								brickIndex: props.state.brickIndex,
								field: props.state.field,
								groupIndex: props.state.groupIndex,
								getFieldPath,
								setFieldPath,
								getGroupIndexes,
								setGroupIndexes,
							}}
						/>
					</Match>
				</Switch>
			</div>
		</div>
	);
};
