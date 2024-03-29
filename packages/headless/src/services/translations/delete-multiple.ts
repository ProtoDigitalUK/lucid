export interface ServiceData {
	ids: Array<number | null>;
}

const deleteMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	await serviceConfig.config.db.client
		.deleteFrom("headless_translation_keys")
		.where(
			"id",
			"in",
			data.ids.filter((id) => id !== null),
		)
		.execute();
};

export default deleteMultiple;
