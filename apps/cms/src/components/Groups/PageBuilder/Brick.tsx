import {
	type Component,
	Show,
	Switch,
	createMemo,
	createSignal,
	onMount,
	Match,
	createEffect,
} from "solid-js";
import classNames from "classnames";
import {
	FaSolidChevronDown,
	FaSolidLock,
	FaSolidTrashCan,
} from "solid-icons/fa";
// Assets
import defaultBrickIconWhite from "@/assets/svgs/default-brick-icon-white.svg";
// Store
import builderStore from "@/store/builderStore";
// Types
import type { BrickConfigT } from "@headless/types/src/bricks";
import type { BrickDataT } from "@/store/builderStore";
// Components
import PageBuilder from "@/components/Groups/PageBuilder";

interface BrickProps {
	state: {
		brick: BrickDataT;
		brickConfig: BrickConfigT[];
		alwaysOpen?: boolean;
	};
}

export const Brick: Component<BrickProps> = (props) => {
	// ------------------------------
	// State
	const [getAccordionOpen, setAccordionOpen] = createSignal(false);

	// ------------------------------------
	// Refs
	let dropdownContentRef: HTMLDivElement | undefined;

	// ------------------------------------
	// Functions
	const toggleAccordion = (state: boolean) => {
		if (props.state.alwaysOpen) return;

		setAccordionOpen(state);

		if (dropdownContentRef) {
			if (state) {
				dropdownContentRef.style.maxHeight = `${dropdownContentRef.scrollHeight}px`;
			} else {
				dropdownContentRef.style.maxHeight = "0px";
			}
		}
	};
	const removeBrick = () => {
		builderStore.get.removeBrick({
			id: props.state.brick.id,
		});
	};

	// ------------------------------------
	// Mount
	onMount(() => {
		if (props.state.alwaysOpen) return;

		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.type === "childList") {
					if (!getAccordionOpen()) return;
					if (dropdownContentRef) {
						dropdownContentRef.style.maxHeight = `${dropdownContentRef.scrollHeight}px`;
						dropdownContentRef.style.transition = "";
					}
				}
			}
		});
		if (dropdownContentRef) {
			observer.observe(dropdownContentRef, {
				childList: true,
				subtree: true,
			});
		}
	});

	// ------------------------------
	// Memos
	const config = createMemo(() => {
		return props.state.brickConfig.find(
			(brick) => brick.key === props.state.brick.key,
		);
	});
	const isFixed = createMemo(() => {
		return props.state.brick.type === "fixed";
	});

	// ------------------------------
	// Effects
	createEffect(() => {
		const brickErrors = builderStore.get.fieldsErrors.filter((field) => {
			return field.brick_id === props.state.brick.id;
		});
		if (brickErrors.length > 0) {
			setAccordionOpen(true);
		}
	});

	// ----------------------------------
	// Render
	return (
		<Show when={config() !== undefined}>
			<li class="w-full mb-15 last:mb-0 bg-container-1 rounded-md border border-border">
				<div
					id={`accordion-${props.state.brick.id}`}
					class={classNames(
						"border-b p-15 flex w-full items-center justify-between duration-200 transition-all cursor-pointer",
						{
							"border-border":
								getAccordionOpen() || props.state.alwaysOpen,
							"border-transparent":
								!getAccordionOpen() && !props.state.alwaysOpen,
						},
					)}
					onClick={() => toggleAccordion(!getAccordionOpen())}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							toggleAccordion(!getAccordionOpen());
						}
					}}
				>
					<div class="flex items-center">
						<span class="w-7 h-7 rounded-md bg-primary-base flex items-center justify-center mr-2.5 fill-white">
							<Switch>
								<Match when={isFixed() === false}>
									<img
										src={defaultBrickIconWhite}
										class="m-auto h-3.5"
										alt=""
									/>
								</Match>
								<Match when={isFixed() === true}>
									<FaSolidLock size={14} />
								</Match>
							</Switch>
						</span>
						<h3 class="font-semibold text-base">
							{config()?.title}
						</h3>
					</div>
					<div class="flex items-center gap-2.5">
						<Show when={isFixed() === false}>
							<button
								type="button"
								class="h-7 w-7 flex items-center justify-center bg-container-4 hover:bg-error-hover hover:border-error-hover fill-black hover:fill-error-contrast border border-border rounded-full duration-200 transition-colors"
								onClick={(e) => {
									e.stopPropagation();
									removeBrick();
								}}
							>
								<FaSolidTrashCan size={14} />
							</button>
						</Show>
						<Show when={props.state.alwaysOpen !== true}>
							<button
								class={classNames(
									"h-7 w-7 flex items-center justify-center hover:bg-primary-hover hover:fill-primary-contrast hover:border-primary-hover rounded-full border transition-all duration-200",
									{
										"rotate-180 bg-primary-hover fill-primary-contrast border-primary-hover":
											getAccordionOpen(),
										"bg-container-4 fill-black border-border":
											!getAccordionOpen(),
									},
								)}
								type="button"
							>
								<FaSolidChevronDown size={14} />
							</button>
						</Show>
					</div>
				</div>
				<div
					ref={dropdownContentRef}
					class={classNames(
						"w-full overflow-hidden transition-all duration-200 max-h-0",
						{
							"max-h-full": props.state.alwaysOpen,
						},
					)}
				>
					<div class="p-15">
						<PageBuilder.BrickBody
							state={{
								brick: props.state.brick,
								config: config() as BrickConfigT,
							}}
						/>
					</div>
				</div>
			</li>
		</Show>
	);
};
