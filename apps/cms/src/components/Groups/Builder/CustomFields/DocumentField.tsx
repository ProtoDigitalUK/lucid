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
	// DocumentMeta,
	CollectionDocumentResponse,
} from "@lucidcms/core/types";
import brickStore from "@/store/brickStore";
import brickHelpers from "@/utils/brick-helpers";
import helpers from "@/utils/helpers";
import Form from "@/components/Groups/Form";
import documentSelectStore from "@/store/forms/documentSelectStore";

interface DocumentFieldProps {
	state: {
		brickIndex: number;
		fieldConfig: CFConfig<"document">;
		fieldData?: FieldResponse;
		groupId?: number | string;
		repeaterKey?: string;
		contentLocale: string;
		fieldError: FieldErrors | undefined;
		altLocaleError: boolean;
	};
}

export const DocumentField: Component<DocumentFieldProps> = (props) => {
	// -------------------------------
	// State
	const [getValue, setValue] = createSignal<number | undefined>();

	// -------------------------------
	// Memos
	const fieldData = createMemo(() => {
		return props.state.fieldData;
	});
	const fieldValue = createMemo(() => {
		return brickHelpers.getFieldValue<number>({
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
		<Form.DocumentSelect
			id={brickHelpers.customFieldId({
				key: props.state.fieldConfig.key,
				brickIndex: props.state.brickIndex,
				groupId: props.state.groupId,
			})}
			collection={props.state.fieldConfig.collection}
			value={getValue()}
			onChange={(value) => {
				batch(() => {
					brickStore.get.setFieldValue({
						brickIndex: props.state.brickIndex,
						fieldConfig: props.state.fieldConfig,
						key: props.state.fieldConfig.key,
						groupId: props.state.groupId,
						repeaterKey: props.state.repeaterKey,
						value: !value ? null : Number(value),
						contentLocale: props.state.contentLocale,
					});
					setValue(value ?? undefined);
				});
			}}
			copy={{
				label: helpers.getLocaleValue({
					value: props.state.fieldConfig.labels.title,
				}),
				describedBy: helpers.getLocaleValue({
					value: props.state.fieldConfig.labels.description,
				}),
			}}
			errors={props.state.fieldError}
			altLocaleError={props.state.altLocaleError}
			disabled={props.state.fieldConfig.disabled}
			required={props.state.fieldConfig.validation?.required || false}
		/>
	);
};
