import type { Component, JSXElement } from "solid-js";
import classNames from "classnames";
import { Dialog } from "@kobalte/core";

interface ModalProps {
	state: {
		open: boolean;
		setOpen: (_open: boolean) => void;
	};
	options?: {
		noPadding?: boolean;
		size?: "large";
	};
	children: JSXElement;
}

export const Modal: Component<ModalProps> = (props) => {
	// ------------------------------
	// Render
	return (
		<Dialog.Root
			open={props.state.open}
			onOpenChange={() => props.state.setOpen(!props.state.open)}
		>
			<Dialog.Portal>
				<Dialog.Overlay class="fixed inset-0 z-40 bg-white bg-opacity-40 animate-animate-fade-out data-[expanded]:animate-animate-fade-in" />
				<div class="fixed inset-0 z-40">
					<Dialog.Content class="overflow-y-auto h-full p-15 !pointer-events-none flex items-center justify-center">
						<div
							class={classNames(
								"max-w-2xl w-full bg-container-1 shadow-md rounded-md overflow-hidden border-border border m-auto pointer-events-auto",
								{
									"max-w-7xl":
										props.options?.size === "large",
								},
							)}
						>
							<div
								class={classNames({
									"p-15 md:p-30": !props.options?.noPadding,
								})}
							>
								{props.children}
							</div>
						</div>
					</Dialog.Content>
				</div>
			</Dialog.Portal>
		</Dialog.Root>
	);
};
