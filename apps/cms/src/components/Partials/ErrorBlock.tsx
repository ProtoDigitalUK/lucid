import { type Component, type JSXElement, Show } from "solid-js";
import classNames from "classnames";
import Link from "@/components/Partials/Link";
import T from "@/translations";

const ErrorBlock: Component<{
	content: {
		image?: string;
		title?: string;
		description?: string;
	};
	link?: {
		text: string;
		href: string;
	};
	options?: {
		contentMaxWidth?: "md";
	};
	children?: JSXElement;
}> = (props) => {
	return (
		<div class={"flex items-center justify-center"}>
			<div class="text-center max-w-xl w-full flex flex-col items-center p-30">
				<Show when={props.content.image}>
					<img
						src={props.content.image}
						class="h-auto mx-auto mb-30 max-w-xs w-full max-h-40 object-contain"
						alt=""
					/>
				</Show>

				<h2 class="mb-15">{props.content.title ?? T()("error_title")}</h2>
				<p
					class={classNames({
						"max-w-96": props.options?.contentMaxWidth === undefined,
						"max-w-md": props.options?.contentMaxWidth === "md",
					})}
				>
					{props.content.description ?? T()("error_message")}
				</p>
				<Show when={props.link !== undefined}>
					<Link
						theme={"primary"}
						size="medium"
						classes="mt-30"
						href={props.link?.href || ""}
					>
						{props.link?.text || ""}
					</Link>
				</Show>
				<Show when={props.children}>
					<div class="mt-30">{props.children}</div>
				</Show>
			</div>
		</div>
	);
};

export default ErrorBlock;
