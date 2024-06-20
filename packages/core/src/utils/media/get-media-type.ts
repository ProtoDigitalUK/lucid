import type { MediaType } from "../../types/response.js";

const getMediaType = (mimeType: string): MediaType => {
	const normalizedMimeType = mimeType.toLowerCase();

	if (normalizedMimeType.includes("image")) return "image";
	if (normalizedMimeType.includes("video")) return "video";
	if (normalizedMimeType.includes("audio")) return "audio";
	if (
		normalizedMimeType.includes("pdf") ||
		normalizedMimeType.startsWith("application/vnd")
	)
		return "document";
	if (
		normalizedMimeType.includes("zip") ||
		normalizedMimeType.includes("tar")
	)
		return "archive";

	return "unknown";
};

export default getMediaType;
