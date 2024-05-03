import {
	type Component,
	type Accessor,
	createSignal,
	createEffect,
} from "solid-js";
import type { CustomField, MediaMeta } from "@protoheadless/core/types";
import brickStore from "@/store/brickStore";
import brickHelpers from "@/utils/brick-helpers";
import Form from "@/components/Groups/Form";

interface MediaFieldProps {
	state: {
		brickIndex: number;
		field: CustomField;
		groupId?: number | string;
		contentLanguage?: number;

		getFieldPath: Accessor<string[]>;
		getGroupPath: Accessor<Array<string | number>>;
	};
}

export const MediaField: Component<MediaFieldProps> = (props) => {
	// -------------------------------
	// State
	const [getValue, setValue] = createSignal<number | undefined>();
	const [getMeta, setMeta] = createSignal<MediaMeta | undefined>();

	// -------------------------------
	// Effects
	createEffect(() => {
		const field = brickHelpers.getBrickField({
			brickIndex: props.state.brickIndex,
			fieldPath: props.state.getFieldPath(),
			groupPath: props.state.getGroupPath(),
			field: props.state.field,
			contentLanguage: props.state.contentLanguage,
		});

		const value = field?.value as number | undefined;
		const meta = field?.meta as MediaMeta | undefined;
		setValue(value);
		setMeta(meta);
	});

	// -------------------------------
	// Render
	return (
		<>
			<Form.MediaSelect
				id={`field-${props.state.field.key}-${props.state.brickIndex}-${props.state.groupId}`}
				value={getValue()}
				meta={getMeta()}
				onChange={(value, meta) =>
					brickStore.get.setFieldValue({
						brickIndex: props.state.brickIndex,
						fieldPath: props.state.getFieldPath(),
						groupPath: props.state.getGroupPath(),
						value: value,
						meta: meta,
					})
				}
				copy={{
					label: props.state.field.title,
					describedBy: props.state.field.description,
				}}
				extensions={props.state.field.validation?.extensions}
				type={props.state.field.validation?.type}
				// errors={props.state.fieldError}
				required={props.state.field.validation?.required || false}
			/>
		</>
	);
};
