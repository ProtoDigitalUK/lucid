import { BrickBuilder } from "@lucidcms/core";

const SEOBrick = new BrickBuilder("seo", {
	title: "SEO",
})
	.addTab({
		key: "basic_tab",
		title: "Basic",
	})
	.addText({
		key: "title",
		title: "SEO Title",
		description:
			"The optimal title tag length for SEO is between 50 to 60 characters long.",
	})
	.addTextarea({
		key: "meta_description",
		title: "Meta Description",
		description:
			"The optimal meta description length for SEO is between 50 to 160 characters long.",
	})
	.addTab({
		key: "social_tab",
		title: "Social",
	})
	.addText({
		key: "social_title",
		title: "Social Title",
	})
	.addTextarea({
		key: "social_description",
		title: "Social Description",
	})
	.addMedia({
		key: "social_image",
		title: "Social Image",
	})
	.addTab({
		key: "advanced_tab",
		title: "Advanced",
	})
	.addText({
		key: "canonical_url",
		title: "Canonical URL",
		description:
			"The canonical URL is the preferred version of a web page that search engines should index.",
	})
	.addText({
		key: "robots",
		title: "Robots",
		description:
			"The robots meta tag and X-Robots-Tag HTTP header controls crawling and indexing of a web page.",
	});

export default SEOBrick;
