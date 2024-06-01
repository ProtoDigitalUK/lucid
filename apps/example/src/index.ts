import lucid, { BrickBuilder } from "@lucidcms/core";

// lucid.fastify.post("/send-email", async (request, reply) => {
// 	const res = await sendEmail({
// 		to: "hello@williamyallop.com",
// 		subject: "Hello",
// 		template: "password-reset",
// 		data: {
// 			firstName: "William",
// 		},
// 	});

// 	reply.send(res);
// });

// lucid.start();

const BannerBrick = new BrickBuilder("banner", {
	description: "A banner with a title and intro text",
	preview: {
		image: "https://headless-dev.up.railway.app/public/banner-brick.png",
	},
})
	.addTab("content_tab", {
		labels: {
			title: "Content",
		},
	})
	.addText("title", {
		labels: {
			description:
				"The title of the banner. This is displayed as an H1 tag.",
		},
		validation: {
			required: true,
		},
	})
	.addWysiwyg("intro")
	.addRepeater("call_to_actions", {
		labels: {
			title: "Call to Actions",
		},
		validation: {
			maxGroups: 3,
		},
	})
	.addLink("link", {
		labels: {
			title: "Link",
		},
	})
	.addRepeater("testing_repeater", {
		labels: {
			title: "Testing",
		},
		validation: {
			maxGroups: 3,
		},
	})
	.addLink("testing_link", {
		labels: {
			title: "Link",
		},
	})
	.endRepeater()
	.endRepeater()
	.addTab("config_tab", {
		labels: {
			title: "Config",
		},
	})
	.addCheckbox("full_width", {
		labels: {
			description: "Make the banner fullwidth",
		},
	});

console.log("-".repeat(50));
console.log("Flat Fields");
console.log("-".repeat(50));
console.log(BannerBrick.flatFields2);

console.log("-".repeat(50));
console.log("Field Tree");
console.log("-".repeat(50));
console.log(BannerBrick.fieldTree2);

console.log("-".repeat(50));
console.log("Field Tree (no tabs)");
console.log("-".repeat(50));
console.log(BannerBrick.fieldTreeNoTab2);
