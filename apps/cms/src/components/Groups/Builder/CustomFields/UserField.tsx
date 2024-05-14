import {
	type Component,
	createSignal,
	batch,
	createMemo,
	createEffect,
} from "solid-js";
import type {
	CustomField,
	FieldResponse,
	FieldErrors,
} from "@lucidcms/core/types";
import brickStore from "@/store/brickStore";
import brickHelpers from "@/utils/brick-helpers";
import Form from "@/components/Groups/Form";
import UserSearchSelect from "@/components/Partials/SearchSelects/UserSearchSelect";

interface UserFieldProps {
	state: {
		brickIndex: number;
		fieldConfig: CustomField;
		fieldData?: FieldResponse;
		groupId?: number | string;
		repeaterKey?: string;
		contentLanguage: string;
		fieldError: FieldErrors | undefined;
	};
}

export const UserField: Component<UserFieldProps> = (props) => {
	// -------------------------------
	// State
	const [getValue, setValue] = createSignal<number>();

	// -------------------------------
	// Memos
	const fieldData = createMemo(() => {
		return props.state.fieldData;
	});

	// -------------------------------
	// Effects
	createEffect(() => {
		const value = brickHelpers.getFieldValue<number>({
			fieldData: fieldData(),
			fieldConfig: props.state.fieldConfig,
			contentLanguage: props.state.contentLanguage,
		});

		setValue(value);
	});

	// -------------------------------
	// Render
	return (
		// TODO: update to user user select modal or select field
		<UserSearchSelect
			id={brickHelpers.customFieldId({
				key: props.state.fieldConfig.key,
				brickIndex: props.state.brickIndex,
				groupId: props.state.groupId,
			})}
			value={getValue()}
			setValue={(value) => {
				batch(() => {
					brickStore.get.setFieldValue({
						brickIndex: props.state.brickIndex,
						fieldConfig: props.state.fieldConfig,
						key: props.state.fieldConfig.key,
						groupId: props.state.groupId,
						repeaterKey: props.state.repeaterKey,
						value: value, // Number(value),
						contentLanguage: props.state.contentLanguage,
					});
					setValue(value as number);
				});
			}}
			name={props.state.fieldConfig.key}
			errors={props.state.fieldError}
			disabled={props.state.fieldConfig.disabled}
			required={props.state.fieldConfig.validation?.required || false}
			theme={"basic"}
		/>
	);
};
