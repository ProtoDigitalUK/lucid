import type { KyselyDB } from "../db/types.js";

export default class TranslationsRepo {
	constructor(private db: KyselyDB) {}

	// ----------------------------------------
	// update / create
	upsertMultiple = async (
		props: {
			value: string | null;
			languageCode: string;
			translationKeyId: number;
		}[],
	) => {
		return this.db
			.insertInto("lucid_translations")
			.values(
				props.map((t) => ({
					value: t.value,
					language_code: t.languageCode,
					translation_key_id: t.translationKeyId,
				})),
			)
			.onConflict((oc) =>
				oc
					.columns(["translation_key_id", "language_code"])
					.doUpdateSet((eb) => ({
						value: eb.ref("excluded.value"),
					})),
			)
			.execute();
	};
}
