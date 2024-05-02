import {
	type Component,
	type Accessor,
	type Setter,
	createMemo,
	For,
} from "solid-js";
import type { CustomField } from "@protoheadless/core/types";
import brickHelpers from "@/utils/brick-helpers";
import contentLanguageStore from "@/store/contentLanguageStore";
import CustomFields from "@/components/Groups/Builder/CustomFields";

interface RepeaterFieldProps {
	state: {
		brickIndex: number;
		field: CustomField;
		groupIndex?: number;
		getFieldPath: Accessor<string[]>;
		setFieldPath: Setter<string[]>;
		getGroupIndexes: Accessor<number[]>;
		setGroupIndexes: Setter<number[]>;
	};
}

export const RepeaterField: Component<RepeaterFieldProps> = (props) => {
	// -------------------------------
	// Memos
	const contentLanguage = createMemo(
		() => contentLanguageStore.get.contentLanguage,
	);

	const fieldData = createMemo(() => {
		const field = brickHelpers.getBrickField({
			brickIndex: props.state.brickIndex,
			fieldPath: props.state.getFieldPath(),
			groupIndexes: props.state.getGroupIndexes(),
		});
		console.log("fieldData", field);

		return field;
	});

	// -------------------------------
	// Render
	if (fieldData() === undefined) return null;

	return (
		<div class="bg-white border border-border mb-15 last:mb-0 p-15 rounded-md">
			<h3>{props.state.field.title}</h3>
			<For each={fieldData()?.groups}>
				{(_, groupIndex) => (
					<div class="p-15 bg-backgroundAccent mb-15 last:mb-0 rounded-md">
						group - {groupIndex()}
						<For each={props.state.field.fields}>
							{(field) => (
								<CustomFields.DynamicField
									state={{
										brickIndex: props.state.brickIndex,
										field: field,
										groupIndex: groupIndex(),
										getFieldPath: props.state.getFieldPath,
										setFieldPath: props.state.setFieldPath,
										getGroupIndexes:
											props.state.getGroupIndexes,
										setGroupIndexes:
											props.state.setGroupIndexes,
									}}
								/>
							)}
						</For>
					</div>
				)}
			</For>
		</div>
	);
};
