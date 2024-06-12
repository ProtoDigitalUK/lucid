import T from "@/translations";
import {
	type Component,
	createSignal,
	createMemo,
	batch,
	createEffect,
} from "solid-js";
import type {
	CFConfig,
	FieldResponse,
	FieldErrors,
} from "@lucidcms/core/types";
import brickStore from "@/store/brickStore";
import brickHelpers from "@/utils/brick-helpers";
import Form from "@/components/Groups/Form";

interface SelectFieldProps {
	state: {
		brickIndex: number;
		fieldConfig: CFConfig<"select">;
		fieldData?: FieldResponse;
		groupId?: number | string;
		repeaterKey?: string;
		contentLocale: string;
		fieldError: FieldErrors | undefined;
		altLocaleHasError: boolean;
	};
}

export const SelectField: Component<SelectFieldProps> = (props) => {
	// -------------------------------
	// State
	const [getValue, setValue] = createSignal<string | number | null>(null);

	// -------------------------------
	// Memos
	const fieldData = createMemo(() => {
		return props.state.fieldData;
	});
	const fieldValue = createMemo(() => {
		return brickHelpers.getFieldValue<string>({
			fieldData: fieldData(),
			fieldConfig: props.state.fieldConfig,
			contentLocale: props.state.contentLocale,
		});
	});

	// -------------------------------
	// Effects
	createEffect(() => {
		setValue(fieldValue() || null);
	});

	// -------------------------------
	// Render
	return (
		<Form.Select
			id={brickHelpers.customFieldId({
				key: props.state.fieldConfig.key,
				brickIndex: props.state.brickIndex,
				groupId: props.state.groupId,
			})}
			value={getValue() || undefined}
			options={
				props.state.fieldConfig.options.map((o, i) => {
					return {
						label:
							brickHelpers.getFieldLabel({
								value: o.label,
								locale: props.state.contentLocale,
							}) ??
							T()("option_label", {
								count: i,
							}),
						value: o.value,
					};
				}) || []
			}
			onChange={(value) => {
				batch(() => {
					brickStore.get.setFieldValue({
						brickIndex: props.state.brickIndex,
						fieldConfig: props.state.fieldConfig,
						key: props.state.fieldConfig.key,
						groupId: props.state.groupId,
						repeaterKey: props.state.repeaterKey,
						value: value || null,
						contentLocale: props.state.contentLocale,
					});
					setValue(value || null);
				});
			}}
			name={props.state.fieldConfig.key}
			copy={{
				label: brickHelpers.getFieldLabel({
					value: props.state.fieldConfig.labels.title,
					locale: props.state.contentLocale,
				}),
				describedBy: brickHelpers.getFieldLabel({
					value: props.state.fieldConfig.labels.description,
					locale: props.state.contentLocale,
				}),
			}}
			altLocaleHasError={props.state.altLocaleHasError}
			noClear={props.state.fieldConfig.validation?.required || false}
			disabled={props.state.fieldConfig.disabled}
			errors={props.state.fieldError}
			required={props.state.fieldConfig.validation?.required || false}
			theme={"basic"}
		/>
	);
};
