import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: "Headless",
			social: {
				github: "https://github.com/ProtoDigitalUK/proto_headless",
			},
			sidebar: [
				{
					label: "Start Here",
					items: [
						{ label: "Getting Started", link: "/getting-started/" },
						{ label: "Why Headless", link: "/why-headless/" },
					],
				},
				// {
				// 	label: "Guides",
				// 	items: [],
				// },
				{
					label: "Configuration",
					items: [
						{
							label: "The Headless Config File",
							link: "/guides/configuring-headless/",
						},
						{ label: "Collections", link: "/guides/collections/" },
						{ label: "Bricks", link: "/guides/bricks/" },
					],
				},
				{
					label: "Plugins",
					items: [
						{
							label: "Forms",
							link: "/plugins/forms/",
						},
						{
							label: "Nested Documents",
							link: "/plugins/nested-documents/",
						},
						{
							label: "Cookie Consent",
							link: "/plugins/cookie-consent/",
						},
						{
							label: "Resend",
							link: "/plugins/resend/",
						},
						{
							label: "Nodemailer",
							link: "/plugins/nodemailer/",
						},
						{
							label: "S3",
							link: "/plugins/s3/",
						},
						{
							label: "Local Storage",
							link: "/plugins/local-storage/",
						},
					],
				},
			],
		}),
	],
});
