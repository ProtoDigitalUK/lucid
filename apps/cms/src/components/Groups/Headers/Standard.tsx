import T from "@/translations";
import { type Component, type JSXElement, Show } from "solid-js";
import classNames from "classnames";
import { FaSolidPlus, FaSolidTrash } from "solid-icons/fa";
import Link from "@/components/Partials/Link";
import Button from "@/components/Partials/Button";
import ContentLocaleSelect from "@/components/Partials/ContentLocaleSelect";

export const Standard: Component<{
	copy?: {
		title?: string;
		description?: string;
	};
	actions?: {
		delete?: {
			open: boolean;
			setOpen: (_open: boolean) => void;
			permission?: boolean;
		};
		create?: {
			open: boolean;
			setOpen: (_open: boolean) => void;
			permission?: boolean;
			label?: string;
		};
		createLink?: {
			link: string;
			label: string;
			permission?: boolean;
		};
		link?: {
			href: string;
			label: string;
			permission?: boolean;
			icon: JSXElement;
			newTab?: boolean;
		};
		contentLocale?: boolean;
	};
	slots?: {
		bottom?: JSXElement;
	};
}> = (props) => {
	// ----------------------------------------
	// Render
	return (
		<div class="bg-container-2 border-b border-border rounded-t-xl">
			<div
				class={classNames(
					"flex justify-between flex-col-reverse md:flex-row items-start gap-x-10 gap-y-15 px-15 md:px-30 pt-15 md:pt-30 pb-15",
					{
						"md:pb-30": !props.slots?.bottom,
					},
				)}
			>
				{/* Title and description */}
				<div class="w-full">
					<Show when={props.copy?.title}>
						<h1>{props.copy?.title}</h1>
					</Show>
					<Show when={props.copy?.description}>
						<p class="mt-1">{props.copy?.description}</p>
					</Show>
				</div>
				{/* Actions */}
				<Show when={props.actions}>
					<div class="flex items-center justify-end space-x-2.5 w-full">
						<Show
							when={
								props.actions?.contentLocale !== undefined &&
								props.actions.contentLocale !== false
							}
						>
							<div class="w-full md:max-w-[220px]">
								<ContentLocaleSelect />
							</div>
						</Show>
						<Show
							when={
								props.actions?.create !== undefined &&
								props.actions.create.permission !== false
							}
						>
							<Button
								type="submit"
								theme="primary"
								size="x-icon"
								onClick={() => {
									props.actions?.create?.setOpen(true);
								}}
							>
								<FaSolidPlus />
								<span class="sr-only">
									{props.actions?.create?.label ?? T()("create")}
								</span>
							</Button>
						</Show>
						<Show
							when={
								props.actions?.createLink !== undefined &&
								props.actions.createLink.permission !== false
							}
						>
							<Link
								theme="primary"
								size="x-icon"
								href={props.actions?.createLink?.link}
							>
								<FaSolidPlus />
								<span class="sr-only">
									{props.actions?.createLink?.label ?? T()("create")}
								</span>
							</Link>
						</Show>
						<Show
							when={
								props.actions?.link !== undefined &&
								props.actions.link.permission !== false
							}
						>
							<Link
								theme="primary"
								size="x-icon"
								href={props.actions?.link?.href}
								target={props.actions?.link?.newTab ? "_blank" : undefined}
							>
								{props.actions?.link?.icon}
								<span class="sr-only">{props.actions?.link?.label}</span>
							</Link>
						</Show>
						<Show
							when={
								props.actions?.delete !== undefined &&
								props.actions.delete.permission !== false
							}
						>
							<Button
								theme="danger"
								size="x-icon"
								type="button"
								onClick={() => props.actions?.delete?.setOpen(true)}
							>
								<span class="sr-only">{T()("delete")}</span>
								<FaSolidTrash />
							</Button>
						</Show>
					</div>
				</Show>
			</div>
			<Show when={props.slots?.bottom}>{props.slots?.bottom}</Show>
		</div>
	);
};
