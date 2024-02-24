import { MediaResT } from "@headless/types/src/media.js";

const formatMedia = (media: {
	id: number;
}): MediaResT => {
	return {
		id: media.id,
	} as MediaResT;
};

export const swaggerMediaRes = {
	type: "object",
	additionalProperties: true,
};

export default formatMedia;
