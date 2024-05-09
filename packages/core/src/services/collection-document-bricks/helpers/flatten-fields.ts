import { v4 as uuidv4 } from "uuid";
import type {
	FieldSchemaType,
	FieldSchemaSimpleType,
	FieldValueSchemaType,
} from "../../../schemas/collection-fields.js";
import type { BooleanInt } from "../../../libs/db/types.js";

export interface FieldInsertItem {
	key: FieldSchemaType["key"];
	type: FieldSchemaType["type"];
	value: FieldValueSchemaType;
	languageId: number;
	groupRef?: string;
	groupId?: number | string;
}
export interface GroupInsertItem {
	ref: string;
	order: number;
	repeater: string;
	open: BooleanInt;
	parentGroupRef?: string;
}

interface FlatFieldsResposne {
	fields: Array<FieldInsertItem>;
	groups: Array<GroupInsertItem>;
}

const flattenFields = (
	fields: FieldSchemaType[] | FieldSchemaSimpleType[],
	languages: Array<{ id: number; code: string; is_default: BooleanInt }>,
): FlatFieldsResposne => {
	const fieldsRes: Array<FieldInsertItem> = [];
	const groupsRes: Array<GroupInsertItem> = [];

	// recursive function to parse fields
	const parseFields = (
		fields: FieldSchemaType[] | FieldSchemaSimpleType[],
		groupMeta?: {
			id?: number | string;
			ref?: string;
			repeaterKey?: string;
		},
	) => {
		// for each field, add to the fiedls array.
		// if its a repeater, store current repeater ref and pass it to the next level
		for (let i = 0; i < fields.length; i++) {
			const field = fields[i];
			if (field === undefined) continue;

			if (field.type === "repeater") {
				const repeaterKey = field.key;

				if (field.groups === undefined) continue;

				for (let j = 0; j < field.groups.length; j++) {
					const groupFields = field.groups[j];
					if (groupFields === undefined) continue;

					const groupRef = uuidv4();

					if (Array.isArray(groupFields)) {
						groupsRes.push({
							ref: groupRef,
							order: j,
							repeater: repeaterKey,
							open: 0,
							parentGroupRef: groupMeta?.ref,
						});
						parseFields(groupFields, {
							ref: groupRef,
							repeaterKey,
						});
						continue;
					}

					groupsRes.push({
						ref: groupRef,
						order: groupFields.order || j,
						open: groupFields.open || 0,
						repeater: repeaterKey,
						parentGroupRef: groupMeta?.ref,
					});
					parseFields(groupFields.fields, {
						id: groupFields.id,
						ref: groupRef,
						repeaterKey,
					});
				}

				continue;
			}

			if (field.translations) {
				for (let [key, value] of Object.entries(field.translations)) {
					const language = languages.find(
						(l) => l.code === key || l.id === Number(key),
					);
					if (language === undefined) continue;

					if (typeof value === "boolean") value = value ? 1 : 0;

					fieldsRes.push({
						key: field.key,
						type: field.type,
						value: value,
						languageId: language.id,
						groupId: groupMeta?.id,
						groupRef: groupMeta?.ref,
					});
				}
			}
		}
	};
	parseFields(fields);

	return {
		fields: fieldsRes,
		groups: groupsRes,
	};
};

export default flattenFields;
