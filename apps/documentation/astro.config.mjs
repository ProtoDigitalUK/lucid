import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
	site: "https://lucidcms.io",
	integrations: [
		starlight({
			title: "Lucid",
			social: {
				github: "https://github.com/ProtoDigitalUK/lucid",
			},
			logo: {
				light: "./src/assets/dark-logo.svg",
				dark: "./src/assets/dark-logo.svg",
				replacesTitle: true,
			},
			components: {
				Hero: "./src/components/Hero.astro",
				SocialIcons: "./src/components/SocialIcons.astro",
			},
			customCss: ["./src/styles.css"],
			sidebar: [
				{
					label: "Start Here",
					items: [
						{
							label: "Getting Started",
							link: "/getting-started/",
						},
						{
							label: "Why Lucid",
							link: "/why-lucid/",
						},
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
							label: "The Lucid Config File",
							link: "/guides/configuring-lucid/",
						},
						{
							label: "Collections",
							link: "/guides/collections/",
						},
						{
							label: "Bricks",
							link: "/guides/bricks/",
						},
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
		tailwind({
			applyBaseStyles: false,
		}),
	],
});
