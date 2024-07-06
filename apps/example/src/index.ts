import lucid, { toolkit, LucidAPIError } from "@lucidcms/core";

lucid.fastify.post("/send-email", async (_, reply) => {
	const res = await toolkit.email.sendEmail({
		to: "hello@williamyallop.com",
		subject: "Hello",
		template: "password-reset",
		data: {
			firstName: "William",
		},
	});
	if (res.error) throw new LucidAPIError(res.error);
	reply.send(res.data);
});

lucid.fastify.get("/get-document", async (_, reply) => {
	const res = await toolkit.document.getSingle({
		collectionKey: "page",
		query: {
			filter: {
				// documentId: {
				// 	value: 1,
				// },
				page_title: {
					value: "About",
					operator: "=",
				},
			},
			// include: ["bricks"],
		},
	});
	if (res.error) throw new LucidAPIError(res.error);
	reply.send(res.data);
});

lucid.start();
