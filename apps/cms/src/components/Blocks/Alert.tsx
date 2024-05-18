import { type Component, Switch, Match, For } from "solid-js";
import classNames from "classnames";
import {
	FaSolidTriangleExclamation,
	FaSolidCheck,
	FaSolidExclamation,
	FaSolidInfo,
} from "solid-icons/fa";

interface AlertProps {
	alerts: Array<{
		type: "warning" | "success" | "info" | "error";
		message: string;
	}>;
}

const Alert: Component<AlertProps> = (props) => {
	// -------------------------------
	// Render
	return (
		<div class="w-full mb-30 last:mb-0">
			<For each={props.alerts}>
				{({ type, message }) => (
					<div
						class={classNames(
							"mb-15 last:mb-0 p-2.5 rounded-md flex items-center bg-container-3 border border-border space-x-15",
						)}
					>
						<span
							class={classNames(
								"w-6 h-6 flex items-center justify-center rounded-full min-w-[24px]",
								{
									"bg-primary-base text-primary-contrast":
										type === "success" || type === "info",
									"bg-error-base text-white":
										type === "error",
									"bg-warning-base text-primary-contrast":
										type === "warning",
								},
							)}
						>
							<Switch>
								<Match when={type === "success"}>
									<FaSolidCheck class="w-3 h-3 m-auto" />
								</Match>
								<Match when={type === "error"}>
									<FaSolidExclamation class="w-3 h-3 m-auto" />
								</Match>
								<Match when={type === "warning"}>
									<FaSolidTriangleExclamation class="w-3 h-3 m-auto" />
								</Match>
								<Match when={type === "info"}>
									<FaSolidInfo class="w-3 h-3 m-auto" />
								</Match>
							</Switch>
						</span>
						<div>{message}</div>
					</div>
				)}
			</For>
		</div>
	);
};

export default Alert;
