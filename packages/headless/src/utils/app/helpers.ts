import { format, getHours } from "date-fns";
import crypto from "node:crypto";

export const parseCount = (count: string | undefined) => {
	return Number.parseInt(count || "0") || 0;
};

export const getEmailHash = (data: {
	to: string;
	template: string;
	data: Record<string, unknown>;
}) => {
	const date = format(new Date(), "dd/MM/yyyy");
	const currentHour = getHours(new Date());
	const hashString = `${JSON.stringify(data)}${data.template}${
		data.to
	}${date}${currentHour}`;

	return crypto.createHash("sha256").update(hashString).digest("hex");
};
