import T from "@/translations";
import { type Component, For, Switch, Match, Show } from "solid-js";
import { FaSolidEllipsisVertical, FaSolidChevronRight } from "solid-icons/fa";
import classNames from "classnames";
import spawnToast from "@/utils/spawn-toast";
import { DropdownMenu } from "@kobalte/core";
import { Link } from "@solidjs/router";
import DropdownContent from "@/components/Partials/DropdownContent";

export interface ActionDropdownProps {
	actions: Array<{
		label: string;
		type: "button" | "link";
		onClick?: () => void;
		href?: string;
		permission?: boolean;
		hide?: boolean;
	}>;
	options?: {
		border?: boolean;
		placement?: "bottom-end";
	};
}

const ActionDropdown: Component<ActionDropdownProps> = (props) => {
	// ----------------------------------------
	// Classes
	const liItemClasses =
		"flex justify-between my-1 items-center px-2.5 rounded-md hover:bg-primaryH w-full text-sm hover:text-primaryText text-left py-1 text-primaryText fill-primaryText";

	// ----------------------------------------
	// Render
	return (
		<DropdownMenu.Root placement={props.options?.placement}>
			<DropdownMenu.Trigger
				onClick={(e) => {
					e.stopPropagation();
				}}
				class={classNames(
					"dropdown-trigger pointer-events-auto w-7 h-7 bg-background rounded-md flex justify-center items-center hover:bg-backgroundAccent",
					{
						"border border-border": props.options?.border,
					},
				)}
			>
				<span class="sr-only">{T("show_options")}</span>
				<DropdownMenu.Icon>
					<FaSolidEllipsisVertical class="fill-body pointer-events-none" />
				</DropdownMenu.Icon>
			</DropdownMenu.Trigger>

			<DropdownContent
				options={{
					class: "w-[200px] !p-1.5",
					rounded: true,
				}}
			>
				<ul class="divide-primaryA divide-y">
					<For each={props.actions}>
						{(action) => (
							<Show when={action.hide !== true}>
								<li
									class={classNames({
										"opacity-50":
											action.permission === false,
									})}
								>
									<Switch>
										<Match when={action.type === "link"}>
											<Link
												href={action.href || "/"}
												class={classNames(
													liItemClasses,
													{
														"cursor-not-allowed":
															action.permission ===
															false,
													},
												)}
												onClick={(e) => {
													e.stopPropagation();
													if (
														action.permission ===
														false
													) {
														spawnToast({
															title: T(
																"no_permission_toast_title",
															),
															message: T(
																"no_permission_toast_message",
															),
															status: "warning",
														});
														e.preventDefault();
													}
												}}
											>
												<span class="line-clamp-1 mr-2.5">
													{action.label}
												</span>
												<FaSolidChevronRight
													size={14}
												/>
											</Link>
										</Match>
										<Match when={action.type === "button"}>
											<button
												type="button"
												onClick={(e) => {
													e.stopPropagation();
													if (
														action.permission ===
														false
													) {
														spawnToast({
															title: T(
																"no_permission_toast_title",
															),
															message: T(
																"no_permission_toast_message",
															),
															status: "warning",
														});
														return;
													}
													action.onClick?.();
												}}
												class={classNames(
													liItemClasses,
													{
														"cursor-not-allowed":
															action.permission ===
															false,
													},
												)}
											>
												<span class="line-clamp-1 mr-2.5">
													{action.label}
												</span>
												<FaSolidChevronRight
													size={14}
												/>
											</button>
										</Match>
									</Switch>
								</li>
							</Show>
						)}
					</For>
				</ul>
			</DropdownContent>
		</DropdownMenu.Root>
	);
};

export default ActionDropdown;
