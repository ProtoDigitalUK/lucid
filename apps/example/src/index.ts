import lucid, {
	toolkit,
	LucidAPIError,
	formatAPIResponse,
} from "@lucidcms/core";

lucid.fastify.post("/send-email", async (request, reply) => {
	const res = await toolkit.email.sendEmail({
		to: "hello@williamyallop.com",
		subject: "Hello",
		template: "password-reset",
		data: {
			firstName: "William",
		},
	});
	if (res.error) throw new LucidAPIError(res.error);
	reply.send(
		formatAPIResponse(request, {
			data: res.data,
		}),
	);
});

lucid.fastify.get("/get-document", async (request, reply) => {
	const PAGE = 1;
	const PER_PAGE = 10;

	const res = await toolkit.document.getMultiple({
		collectionKey: "page",
		query: {
			filter: {
				// documentId: {
				// 	value: 1,
				// },
				// page_title: {
				// 	value: "About",
				// 	operator: "=",
				// },
			},
			page: PAGE,
			perPage: PER_PAGE,
		},
	});
	if (res.error) throw new LucidAPIError(res.error);
	reply.send(
		formatAPIResponse(request, {
			data: res.data.data,
			pagination: {
				count: res.data.count,
				page: PAGE,
				perPage: PER_PAGE,
			},
		}),
	);
});

lucid.start();
