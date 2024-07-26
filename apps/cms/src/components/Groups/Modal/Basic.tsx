import { type Component, type JSXElement, Show } from "solid-js";
import { FaSolidXmark } from "solid-icons/fa";
import { AlertDialog } from "@kobalte/core";

interface BasicProps {
	state: {
		open: boolean;
		setOpen: (_open: boolean) => void;
	};
	content: {
		title: string;
		description?: string;
	};
	children?: JSXElement;
	onConfirm: () => void;
	onCancel: () => void;
}

export const Basic: Component<BasicProps> = (props) => {
	// ------------------------------
	// Render
	return (
		<AlertDialog.Root
			open={props.state.open}
			onOpenChange={() => props.state.setOpen(!props.state.open)}
		>
			<AlertDialog.Portal>
				<AlertDialog.Overlay class="fixed inset-0 z-50 bg-white bg-opacity-40 animate-animate-fade-out data-[expanded]:animate-animate-fade-in" />
				<div class="fixed inset-0 z-50 flex items-center justify-center p-15 overflow-y-auto">
					<AlertDialog.Content class="z-50 max-w-2xl w-full bg-container-1 shadow-md rounded-md border-border border m-auto">
						<div class="flex items-baseline justify-between p-15 md:p-5 border-b border-border">
							<AlertDialog.Title>
								{props.content.title}
							</AlertDialog.Title>
							<AlertDialog.CloseButton class="hover:fill-error-contrast h-8 w-8 min-w-[32px] rounded-full flex justify-center items-center bg-container-1 hover:bg-error-base duration-200 transition-colors">
								<FaSolidXmark />
							</AlertDialog.CloseButton>
						</div>
						<div class="p-15 md:px-5 md:py-30">
							<Show when={props.content.description}>
								<AlertDialog.Description>
									{props.content.description}
								</AlertDialog.Description>
							</Show>
							<Show when={props.children}>{props.children}</Show>
						</div>
					</AlertDialog.Content>
				</div>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	);
};
