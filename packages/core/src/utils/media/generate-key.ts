import T from "../../translations/index.js";
import { getMonth, getYear } from "date-fns";
import slug from "slug";
import type { ServiceResponse } from "../../utils/services/types.js";

const generateKey = (
	name: string,
	fileExtension: string | null,
): Awaited<ServiceResponse<string>> => {
	const [fname, extension] = name.split(".");
	const ext = fileExtension || extension;

	if (!fname || !ext) {
		return {
			error: {
				type: "basic",
				name: T("media_name_invalid"),
				message: T("media_name_invalid"),
				status: 400,
			},
			data: undefined,
		};
	}

	let filename = slug(fname, {
		lower: true,
	});
	if (filename.length > 254) filename = filename.slice(0, 254);
	const uuid = Math.random().toString(36).slice(-6);
	const date = new Date();
	const month = getMonth(date);
	const monthF = month + 1 >= 10 ? `${month + 1}` : `0${month + 1}`;

	return {
		error: undefined,
		data: `${getYear(date)}/${monthF}/${uuid}-${filename}.${ext}`,
	};
};

export default generateKey;
