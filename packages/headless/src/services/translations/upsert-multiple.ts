export interface ServiceData<K extends string> {
	keys: Record<K, number | null>;
	translations: Array<{
		value: string | null;
		language_id: number;
		key: K;
	}>;
}

const upsertMultiple = async <K extends string>(
	serviceConfig: ServiceConfigT,
	data: ServiceData<K>,
) => {
	const translations = data.translations
		.map((translation) => {
			return {
				value: translation.value ?? "",
				language_id: translation.language_id,
				translation_key_id: data.keys[translation.key] ?? null,
			};
		})
		.filter(
			(translation) => translation.translation_key_id !== null,
		) as Array<{
		value: string;
		language_id: number;
		translation_key_id: number;
	}>;

	await serviceConfig.db
		.insertInto("headless_translations")
		.values(translations)
		.onConflict((oc) =>
			oc
				.columns(["translation_key_id", "language_id"])
				.doUpdateSet((eb) => ({
					value: eb.ref("excluded.value"),
				})),
		)
		.execute();
};

export default upsertMultiple;
