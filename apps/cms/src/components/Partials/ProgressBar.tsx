import classNames from "classnames";
import { type Component, createSignal, onMount, Show } from "solid-js";

interface ProgressBarProps {
	progress: number;
	type: "usage" | "target";
	labels?: {
		start?: string;
		end?: string;
	};
}

const ProgressBar: Component<ProgressBarProps> = (props) => {
	// ----------------------------------------
	// State
	const [getProgress, setProgress] = createSignal(0);

	// ----------------------------------------
	// On Mount
	onMount(() => {
		setProgress(props.progress);
	});

	// ----------------------------------------
	// Render
	return (
		<>
			<div
				class="w-full bg-backgroundAccent h-3 rounded-md overflow-hidden"
				role="progressbar"
				aria-valuenow={getProgress()}
				aria-valuemin="0"
				aria-valuemax="100"
				aria-valuetext={`${getProgress()}% progress`}
			>
				<div
					class={classNames(
						"h-full rounded-md duration-200 transition-all",
						{
							// usage
							"bg-error":
								props.type === "usage" && getProgress() > 90,
							"bg-secondary":
								props.type === "usage" && getProgress() <= 90,
							// target
							"bg-primary ":
								props.type === "target" && getProgress() > 90,
							"bg-secondary ":
								props.type === "target" && getProgress() <= 90,
						},
					)}
					style={{
						width: `${getProgress()}%`,
					}}
				/>
			</div>
			<Show when={props.labels}>
				<div class="flex justify-between gap-15 mt-2.5">
					<span class="text-sm">{props.labels?.start}</span>
					<span class="text-sm">{props.labels?.end}</span>
				</div>
			</Show>
		</>
	);
};

export default ProgressBar;
