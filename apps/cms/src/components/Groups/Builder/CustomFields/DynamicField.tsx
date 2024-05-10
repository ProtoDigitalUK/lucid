import { type Component, Match, Switch, Show, createMemo, For } from "solid-js";
import classNames from "classnames";
import type { CustomField, FieldResponse } from "@lucidcms/core/types";
import brickStore from "@/store/brickStore";
import contentLanguageStore from "@/store/contentLanguageStore";
import CustomFields from "@/components/Groups/Builder/CustomFields";
import FieldTypeIcon from "@/components/Partials/FieldTypeIcon";

interface DynamicFieldProps {
	state: {
		brickIndex: number;
		fieldConfig: CustomField;
		fields: FieldResponse[];
		activeTab?: string;

		groupId?: number | string;
		repeaterKey?: string;
		repeaterDepth?: number;
	};
}

export const DynamicField: Component<DynamicFieldProps> = (props) => {
	// -------------------------------
	// Memos
	const contentLanguage = createMemo(
		() => contentLanguageStore.get.contentLanguage ?? 1,
	);
	const fieldData = createMemo(() => {
		if (props.state.fieldConfig.type === "tab") return;

		const field = props.state.fields?.find(
			(f) => f.key === props.state.fieldConfig.key,
		);

		if (!field) {
			return brickStore.get.addField({
				brickIndex: props.state.brickIndex,
				fieldConfig: props.state.fieldConfig,
				groupId: props.state.groupId,
				repeaterKey: props.state.repeaterKey,
				contentLanguage: contentLanguage(),
			});
		}
		return field;
	});
	const fieldError = createMemo(() => {
		return brickStore.get.fieldsErrors.find((f) => {
			return (
				f.key === props.state.fieldConfig.key &&
				f.languageId === contentLanguage() &&
				f.groupId === props.state.groupId
			);
		});
	});

	// -------------------------------
	// Render
	return (
		<Show when={props.state.fieldConfig.hidden !== true}>
			<div class="w-full mb-15 last:mb-0 relative">
				<Show when={props.state.fieldConfig.type !== "tab"}>
					<FieldTypeIcon type={props.state.fieldConfig.type} />
				</Show>
				<div
					class={classNames("w-full h-full", {
						"pl-[38px]": props.state.fieldConfig.type !== "tab",
					})}
				>
					<Switch>
						<Match when={props.state.fieldConfig.type === "tab"}>
							<Show
								when={
									props.state.activeTab ===
									props.state.fieldConfig.key
								}
							>
								<For each={props.state.fieldConfig.fields}>
									{(config) => (
										<DynamicField
											state={{
												brickIndex:
													props.state.brickIndex,
												fieldConfig: config,
												fields: props.state.fields,
												activeTab:
													props.state.activeTab,
												groupId: props.state.groupId,
												repeaterKey:
													props.state.repeaterKey,
												repeaterDepth:
													props.state.repeaterDepth,
											}}
										/>
									)}
								</For>
							</Show>
						</Match>
						<Match when={props.state.fieldConfig.type === "text"}>
							<CustomFields.InputField
								type="text"
								state={{
									brickIndex: props.state.brickIndex,
									fieldConfig: props.state.fieldConfig,
									fieldData: fieldData(),
									groupId: props.state.groupId,
									repeaterKey: props.state.repeaterKey,
									contentLanguage: contentLanguage(),
									fieldError: fieldError(),
								}}
							/>
						</Match>
						<Match when={props.state.fieldConfig.type === "user"}>
							<CustomFields.UserField
								state={{
									brickIndex: props.state.brickIndex,
									fieldConfig: props.state.fieldConfig,
									fieldData: fieldData(),
									groupId: props.state.groupId,
									repeaterKey: props.state.repeaterKey,
									contentLanguage: contentLanguage(),
									fieldError: fieldError(),
								}}
							/>
						</Match>
						<Match when={props.state.fieldConfig.type === "number"}>
							<CustomFields.InputField
								type="number"
								state={{
									brickIndex: props.state.brickIndex,
									fieldConfig: props.state.fieldConfig,
									fieldData: fieldData(),
									groupId: props.state.groupId,
									repeaterKey: props.state.repeaterKey,
									contentLanguage: contentLanguage(),
									fieldError: fieldError(),
								}}
							/>
						</Match>
						<Match
							when={props.state.fieldConfig.type === "datetime"}
						>
							<CustomFields.InputField
								type="datetime-local"
								state={{
									brickIndex: props.state.brickIndex,
									fieldConfig: props.state.fieldConfig,
									fieldData: fieldData(),
									groupId: props.state.groupId,
									repeaterKey: props.state.repeaterKey,
									contentLanguage: contentLanguage(),
									fieldError: fieldError(),
								}}
							/>
						</Match>
						<Match
							when={props.state.fieldConfig.type === "checkbox"}
						>
							<CustomFields.CheckboxField
								state={{
									brickIndex: props.state.brickIndex,
									fieldConfig: props.state.fieldConfig,
									fieldData: fieldData(),
									groupId: props.state.groupId,
									repeaterKey: props.state.repeaterKey,
									contentLanguage: contentLanguage(),
									fieldError: fieldError(),
								}}
							/>
						</Match>
						<Match when={props.state.fieldConfig.type === "colour"}>
							<CustomFields.ColourField
								state={{
									brickIndex: props.state.brickIndex,
									fieldConfig: props.state.fieldConfig,
									fieldData: fieldData(),
									groupId: props.state.groupId,
									repeaterKey: props.state.repeaterKey,
									contentLanguage: contentLanguage(),
									fieldError: fieldError(),
								}}
							/>
						</Match>
						<Match when={props.state.fieldConfig.type === "json"}>
							<CustomFields.JSONField
								state={{
									brickIndex: props.state.brickIndex,
									fieldConfig: props.state.fieldConfig,
									fieldData: fieldData(),
									groupId: props.state.groupId,
									repeaterKey: props.state.repeaterKey,
									contentLanguage: contentLanguage(),
									fieldError: fieldError(),
								}}
							/>
						</Match>
						<Match when={props.state.fieldConfig.type === "link"}>
							<CustomFields.LinkField
								state={{
									brickIndex: props.state.brickIndex,
									fieldConfig: props.state.fieldConfig,
									fieldData: fieldData(),
									groupId: props.state.groupId,
									repeaterKey: props.state.repeaterKey,
									contentLanguage: contentLanguage(),
									fieldError: fieldError(),
								}}
							/>
						</Match>
						<Match when={props.state.fieldConfig.type === "media"}>
							<CustomFields.MediaField
								state={{
									brickIndex: props.state.brickIndex,
									fieldConfig: props.state.fieldConfig,
									fieldData: fieldData(),
									groupId: props.state.groupId,
									repeaterKey: props.state.repeaterKey,
									contentLanguage: contentLanguage(),
									fieldError: fieldError(),
								}}
							/>
						</Match>
						<Match when={props.state.fieldConfig.type === "select"}>
							<CustomFields.SelectField
								state={{
									brickIndex: props.state.brickIndex,
									fieldConfig: props.state.fieldConfig,
									fieldData: fieldData(),
									groupId: props.state.groupId,
									repeaterKey: props.state.repeaterKey,
									contentLanguage: contentLanguage(),
									fieldError: fieldError(),
								}}
							/>
						</Match>
						<Match
							when={props.state.fieldConfig.type === "textarea"}
						>
							<CustomFields.TextareaField
								state={{
									brickIndex: props.state.brickIndex,
									fieldConfig: props.state.fieldConfig,
									fieldData: fieldData(),
									groupId: props.state.groupId,
									repeaterKey: props.state.repeaterKey,
									contentLanguage: contentLanguage(),
									fieldError: fieldError(),
								}}
							/>
						</Match>
						<Match
							when={props.state.fieldConfig.type === "wysiwyg"}
						>
							<CustomFields.WYSIWYGField
								state={{
									brickIndex: props.state.brickIndex,
									fieldConfig: props.state.fieldConfig,
									fieldData: fieldData(),
									groupId: props.state.groupId,
									repeaterKey: props.state.repeaterKey,
									contentLanguage: contentLanguage(),
									fieldError: fieldError(),
								}}
							/>
						</Match>
						<Match
							when={props.state.fieldConfig.type === "repeater"}
						>
							<CustomFields.RepeaterField
								state={{
									brickIndex: props.state.brickIndex,
									fieldConfig: props.state.fieldConfig,
									fieldData: fieldData(),
									groupId: props.state.groupId,
									parentRepeaterKey: props.state.repeaterKey,
									repeaterDepth:
										props.state.repeaterDepth ?? 0,
								}}
							/>
						</Match>
					</Switch>
				</div>
			</div>
		</Show>
	);
};
