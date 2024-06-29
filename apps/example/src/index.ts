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
				id: {
					value: 1,
					operator: "=",
				},
				is_deleted: {
					value: 1,
					operator: "!=",
				},
				full_slug: {
					value: "/test",
					operator: "=",
				},
			},
			include: ["bricks"],
		},
	});
	if (res.error) throw new LucidAPIError(res.error);
	reply.send(res.data);
});

lucid.start();
