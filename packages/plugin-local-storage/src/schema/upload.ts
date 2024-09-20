import { z } from "@lucidcms/core";

export default {
	body: undefined,
	query: z.object({
		token: z.string(),
		timestamp: z.string(),
		key: z.string(),
	}),
	params: undefined,
};
