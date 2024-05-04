import {
	type Component,
	type Accessor,
	createSignal,
	onMount,
	batch,
} from "solid-js";
import type { CustomField, LinkValue } from "@lucidcms/core/types";
import brickStore from "@/store/brickStore";
import brickHelpers from "@/utils/brick-helpers";
import Form from "@/components/Groups/Form";

interface LinkFieldProps {
	state: {
		brickIndex: number;
		field: CustomField;
		groupId?: number | string;
		contentLanguage?: number;

		getFieldPath: Accessor<string[]>;
		getGroupPath: Accessor<Array<string | number>>;
	};
}

export const LinkField: Component<LinkFieldProps> = (props) => {
	// -------------------------------
	// State
	const [getValue, setValue] = createSignal<LinkValue | undefined | null>();

	// -------------------------------
	// Effects
	onMount(() => {
		const field = brickHelpers.getBrickField({
			brickIndex: props.state.brickIndex,
			fieldPath: props.state.getFieldPath(),
			groupPath: props.state.getGroupPath(),
			field: props.state.field,
			contentLanguage: props.state.contentLanguage,
		});
		const value = field?.value as LinkValue | undefined | null;
		setValue(value);
	});

	// -------------------------------
	// Render
	return (
		<>
			<Form.LinkSelect
				id={`field-${props.state.field.key}-${props.state.brickIndex}-${props.state.groupId}`}
				type={"link"}
				value={getValue()}
				onChange={(value) => {
					batch(() => {
						brickStore.get.setFieldValue({
							brickIndex: props.state.brickIndex,
							fieldPath: props.state.getFieldPath(),
							groupPath: props.state.getGroupPath(),
							value: value,
						});
						setValue(value);
					});
				}}
				meta={null}
				copy={{
					label: props.state.field.title,
					describedBy: props.state.field.description,
				}}
				// errors={props.state.fieldError}
				required={props.state.field.validation?.required || false}
			/>
		</>
	);
};
