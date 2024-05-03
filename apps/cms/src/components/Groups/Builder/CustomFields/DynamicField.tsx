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
		groupId?: number | string;
		getFieldPath?: Accessor<string[]>;
		setFieldPath?: Setter<string[]>;
		getGroupPath: Accessor<Array<string | number>>;
		setGroupPath: Setter<Array<string | number>>;
	};
}

export const DynamicField: Component<DynamicFieldProps> = (props) => {
	// -------------------------------
	// State
	const [getFieldPath, setFieldPath] = createSignal<string[]>(
		props.state.getFieldPath?.() || [],
	);
	const [getGroupPath, setGroupPath] = createSignal<Array<string | number>>(
		props.state.getGroupPath?.() || [],
	);

	// -------------------------------
	// Memos
	const fieldError = createMemo(() => {});

	setFieldPath((prev) => [...prev, props.state.field.key]);
	setGroupPath((prev) => {
		if (props.state.groupId === undefined) return prev;
		return [...prev, props.state.groupId];
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
								groupId: props.state.groupId,
								getFieldPath,
								getGroupPath,
							}}
						/>
					</Match>
					<Match when={props.state.field.type === "number"}>
						<CustomFields.InputField
							type="number"
							state={{
								brickIndex: props.state.brickIndex,
								field: props.state.field,
								groupId: props.state.groupId,
								getFieldPath,
								getGroupPath,
							}}
						/>
					</Match>
					<Match when={props.state.field.type === "datetime"}>
						<CustomFields.InputField
							type="datetime-local"
							state={{
								brickIndex: props.state.brickIndex,
								field: props.state.field,
								groupId: props.state.groupId,
								getFieldPath,
								getGroupPath,
							}}
						/>
					</Match>
					<Match when={props.state.field.type === "repeater"}>
						<CustomFields.RepeaterField
							state={{
								brickIndex: props.state.brickIndex,
								field: props.state.field,
								groupId: props.state.groupId,
								getFieldPath,
								setFieldPath,
								getGroupPath,
								setGroupPath,
							}}
						/>
					</Match>
				</Switch>
			</div>
		</div>
	);
};
