import type { Config } from "../libs/config/config-schema.js";

export default class Translations {
	constructor(private config: Config) {}

	upsertMultiple = (
		data: {
			value: string | null;
			languageId: number;
			translationKeyId: number;
		}[],
	) => {
		return this.config.db.client
			.insertInto("headless_translations")
			.values(
				data.map((t) => ({
					value: t.value,
					language_id: t.languageId,
					translation_key_id: t.translationKeyId,
				})),
			)
			.onConflict((oc) =>
				oc
					.columns(["translation_key_id", "language_id"])
					.doUpdateSet((eb) => ({
						value: eb.ref("excluded.value"),
					})),
			)
			.execute();
	};
}
