export const parseCount = (count: string | undefined) => {
	return parseInt(count || "0") || 0;
};
