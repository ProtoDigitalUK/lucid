import {
	type Component,
	createSignal,
	createMemo,
	batch,
	createEffect,
} from "solid-js";
import type {
	CustomField,
	LinkValue,
	FieldResponse,
	FieldErrors,
} from "@lucidcms/core/types";
import brickStore from "@/store/brickStore";
import brickHelpers from "@/utils/brick-helpers";
import Form from "@/components/Groups/Form";

interface LinkFieldProps {
	state: {
		brickIndex: number;
		fieldConfig: CustomField;
		fieldData?: FieldResponse;
		groupId?: number | string;
		repeaterKey?: string;
		contentLocale: string;
		fieldError: FieldErrors | undefined;
	};
}

export const LinkField: Component<LinkFieldProps> = (props) => {
	// -------------------------------
	// State
	const [getValue, setValue] = createSignal<LinkValue | undefined | null>();

	// -------------------------------
	// Memos
	const fieldData = createMemo(() => {
		return props.state.fieldData;
	});
	const fieldValue = createMemo(() => {
		return brickHelpers.getFieldValue<LinkValue | null>({
			fieldData: fieldData(),
			fieldConfig: props.state.fieldConfig,
			contentLocale: props.state.contentLocale,
		});
	});

	// -------------------------------
	// Effects
	createEffect(() => {
		setValue(fieldValue());
	});

	// -------------------------------
	// Render
	return (
		<>
			<Form.LinkSelect
				id={brickHelpers.customFieldId({
					key: props.state.fieldConfig.key,
					brickIndex: props.state.brickIndex,
					groupId: props.state.groupId,
				})}
				value={getValue()}
				onChange={(value) => {
					batch(() => {
						brickStore.get.setFieldValue({
							brickIndex: props.state.brickIndex,
							fieldConfig: props.state.fieldConfig,
							key: props.state.fieldConfig.key,
							groupId: props.state.groupId,
							repeaterKey: props.state.repeaterKey,
							value: value,
							contentLocale: props.state.contentLocale,
						});
						setValue(value);
					});
				}}
				copy={{
					label: props.state.fieldConfig.title,
					describedBy: props.state.fieldConfig.description,
				}}
				disabled={props.state.fieldConfig.disabled}
				errors={props.state.fieldError}
				required={props.state.fieldConfig.validation?.required || false}
			/>
		</>
	);
};
