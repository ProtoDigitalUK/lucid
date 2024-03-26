export const formatDate = (date: Date | null): string | null => {
	return date ? date.toISOString() : null;
};
