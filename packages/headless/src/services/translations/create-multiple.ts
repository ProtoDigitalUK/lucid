import T from "../../translations/index.js";
import { APIError } from "../../utils/app/error-handler.js";
import { sql } from "kysely";

export interface ServiceData<K extends string> {
	keys: K[];
	translations: Array<{
		value: string | null;
		language_id: number;
		key: K;
	}>;
}

const createMultiple = async <K extends string>(
	serviceConfig: ServiceConfigT,
	data: ServiceData<K>,
) => {
	if (data.keys.length === 0) {
		throw new APIError({
			type: "basic",
			name: T("error_not_created_name", {
				name: T("translation"),
			}),
			message: T("error_not_created_message", {
				name: T("translation"),
			}),
			status: 400,
		});
	}

	const { rows } = await sql
		.raw<{ id: number }>(`
        INSERT INTO headless_translation_keys (id)
        SELECT nextval('headless_translation_keys_id_seq')
        FROM generate_series(1, ${data.keys.length})
        RETURNING id`)
		.execute(serviceConfig.db);

	if (rows.length !== data.keys.length) {
		throw new APIError({
			type: "basic",
			name: T("error_not_created_name", {
				name: T("translation"),
			}),
			message: T("error_not_created_message", {
				name: T("translation"),
			}),
			status: 400,
		});
	}

	const keys: Record<K, number> = data.keys.reduce(
		(keys, key, index) => {
			keys[key] = rows[index].id;
			return keys;
		},
		{} as Record<K, number>,
	);

	if (data.translations.length === 0) {
		return keys;
	}

	await serviceConfig.db
		.insertInto("headless_translations")
		.values(
			data.translations.map((translation) => {
				return {
					translation_key_id: keys[translation.key],
					language_id: translation.language_id,
					value: translation.value,
				};
			}),
		)
		.execute();

	return keys;
};

export default createMultiple;
