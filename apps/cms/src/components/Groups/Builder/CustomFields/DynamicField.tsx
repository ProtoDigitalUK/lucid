import {
	type Component,
	type Accessor,
	type Setter,
	Match,
	Switch,
	Show,
	createMemo,
	createSignal,
	For,
} from "solid-js";
import classNames from "classnames";
import type { CustomField } from "@lucidcms/core/types";
import contentLanguageStore from "@/store/contentLanguageStore";
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
		getGroupPath?: Accessor<Array<string | number>>;
		setGroupPath?: Setter<Array<string | number>>;
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
	const contentLanguage = createMemo(
		() => contentLanguageStore.get.contentLanguage,
	);
	const fieldError = createMemo(() => {});

	// -------------------------------
	// Effects
	setFieldPath((prev) => [...prev, props.state.field.key]);
	setGroupPath((prev) => {
		if (props.state.groupId === undefined) return prev;
		return [...prev, props.state.groupId];
	});

	// -------------------------------
	// Render
	// TODO: all fields need error handling support
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
				<Switch>
					<Match when={props.state.field.type === "tab"}>
						<Show
							when={
								props.state.activeTab === props.state.field.key
							}
						>
							<For each={props.state.field.fields}>
								{(field) => (
									<DynamicField
										state={{
											brickIndex: props.state.brickIndex,
											field: field,
											getFieldPath,
											setFieldPath,
											getGroupPath,
											setGroupPath,
										}}
									/>
								)}
							</For>
						</Show>
					</Match>
					<Match when={props.state.field.type === "text"}>
						<CustomFields.InputField
							type="text"
							state={{
								brickIndex: props.state.brickIndex,
								field: props.state.field,
								groupId: props.state.groupId,
								getFieldPath,
								getGroupPath,
								contentLanguage: contentLanguage(),
							}}
						/>
					</Match>
					<Match when={props.state.field.type === "user"}>
						TODO: ({props.state.field.key} -{" "}
						{props.state.field.repeaterKey})
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
								contentLanguage: contentLanguage(),
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
								contentLanguage: contentLanguage(),
							}}
						/>
					</Match>
					<Match when={props.state.field.type === "checkbox"}>
						<CustomFields.CheckboxField
							state={{
								brickIndex: props.state.brickIndex,
								field: props.state.field,
								groupId: props.state.groupId,
								getFieldPath,
								getGroupPath,
								contentLanguage: contentLanguage(),
							}}
						/>
					</Match>
					<Match when={props.state.field.type === "colour"}>
						<CustomFields.ColourField
							state={{
								brickIndex: props.state.brickIndex,
								field: props.state.field,
								groupId: props.state.groupId,
								getFieldPath,
								getGroupPath,
								contentLanguage: contentLanguage(),
							}}
						/>
					</Match>
					<Match when={props.state.field.type === "json"}>
						<CustomFields.JSONField
							state={{
								brickIndex: props.state.brickIndex,
								field: props.state.field,
								groupId: props.state.groupId,
								getFieldPath,
								getGroupPath,
								contentLanguage: contentLanguage(),
							}}
						/>
					</Match>
					<Match when={props.state.field.type === "link"}>
						<CustomFields.LinkField
							state={{
								brickIndex: props.state.brickIndex,
								field: props.state.field,
								groupId: props.state.groupId,
								getFieldPath,
								getGroupPath,
								contentLanguage: contentLanguage(),
							}}
						/>
					</Match>
					<Match when={props.state.field.type === "media"}>
						<CustomFields.MediaField
							state={{
								brickIndex: props.state.brickIndex,
								field: props.state.field,
								groupId: props.state.groupId,
								getFieldPath,
								getGroupPath,
								contentLanguage: contentLanguage(),
							}}
						/>
					</Match>
					<Match when={props.state.field.type === "select"}>
						<CustomFields.SelectField
							state={{
								brickIndex: props.state.brickIndex,
								field: props.state.field,
								groupId: props.state.groupId,
								getFieldPath,
								getGroupPath,
								contentLanguage: contentLanguage(),
							}}
						/>
					</Match>
					<Match when={props.state.field.type === "textarea"}>
						<CustomFields.TextareaField
							state={{
								brickIndex: props.state.brickIndex,
								field: props.state.field,
								groupId: props.state.groupId,
								getFieldPath,
								getGroupPath,
								contentLanguage: contentLanguage(),
							}}
						/>
					</Match>
					<Match when={props.state.field.type === "wysiwyg"}>
						<CustomFields.WYSIWYGField
							state={{
								brickIndex: props.state.brickIndex,
								field: props.state.field,
								groupId: props.state.groupId,
								getFieldPath,
								getGroupPath,
								contentLanguage: contentLanguage(),
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
