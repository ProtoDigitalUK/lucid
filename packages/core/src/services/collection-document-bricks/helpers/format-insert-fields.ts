import type createMultipleGroups from "../create-multiple-groups.js";
import type { FieldInsertItem } from "./flatten-fields.js";
import { fieldColumnValueMap } from "../../../utils/field-helpers.js";

const formatInsertFields = (props: {
	brickId: number;
	groups: Awaited<ReturnType<typeof createMultipleGroups>>;
	fields: FieldInsertItem[];
}) => {
	return props.fields.map((field) => {
		const targetGroup = props.groups.find((g) => g.ref === field.groupRef);

		return {
			languageCode: field.languageCode,
			collectionBrickId: props.brickId,
			key: field.key,
			type: field.type,
			groupId: targetGroup?.group_id ?? null,
			textValue: null,
			intValue: null,
			boolValue: null,
			jsonValue: null,
			mediaId: null,
			userId: null,
			...fieldColumnValueMap(field),
		};
	});
};

export default formatInsertFields;
