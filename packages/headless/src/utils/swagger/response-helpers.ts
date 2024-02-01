export const response200 = (propertise: unknown) => {
	return {
		description: "Successful response",
		type: "object",
		properties: {
			data: propertise,
			meta: {},
		},
	};
};
