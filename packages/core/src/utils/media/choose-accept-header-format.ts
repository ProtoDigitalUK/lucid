const chooseAcceptHeaderFormat = (
	accept: string | undefined,
	queryFormat?: "avif" | "webp" | "jpeg" | "png" | undefined,
) => {
	if (queryFormat) return queryFormat;

	if (accept) {
		if (accept.includes("image/avif")) return "avif";
		if (accept.includes("image/webp")) return "webp";
	}

	return undefined;
};

export default chooseAcceptHeaderFormat;
