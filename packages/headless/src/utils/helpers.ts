import T from "../translations/index.js";
import { format, getHours } from "date-fns";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { stringifyJSON } from "./format-helpers.js";

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
	const hashString = `${stringifyJSON(data.data)}${data.template}${
		data.to
	}${date}${currentHour}`;

	return crypto.createHash("sha256").update(hashString).digest("hex");
};

export const getDirName = (metaUrl: string) => {
	return dirname(fileURLToPath(metaUrl));
};

export interface ErrorContentT {
	name: string;
	message: string;
}

export const upsertErrorContent = (
	create: boolean,
	translation: string,
): ErrorContentT => {
	if (create) {
		return {
			name: T("error_not_created_name", {
				name: translation,
			}),
			message: T("error_not_created_message", {
				name: translation,
			}),
		};
	}

	return {
		name: T("error_not_updated_name", {
			name: translation,
		}),
		message: T("update_error_message", {
			name: translation.toLowerCase(),
		}),
	};
};
