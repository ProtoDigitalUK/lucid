export const formatDate = (date: Date | string | null): string | null => {
	if (typeof date === "string") {
		return date;
	}
	return date ? date.toISOString() : null;
};

export const parseJSON = <T>(json: string | null | undefined): T | null => {
	if (!json) return null;
	try {
		return JSON.parse(json);
	} catch (error) {
		return null;
	}
};

export const stringifyJSON = (
	json: Record<string, unknown> | null,
): string | null => {
	if (!json) return null;
	return JSON.stringify(json);
};
