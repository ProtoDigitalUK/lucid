import { type Component, createSignal } from "solid-js";
import Headers from "@/components/Groups/Headers";
import Layout from "@/components/Groups/Layout";
import Panel from "@/components/Groups/Panel";
import Modal from "@/components/Groups/Modal";

const TestRoute: Component = () => {
	// ----------------------------------
	// State
	const [getOpenPanel, setOpenPanel] = createSignal<boolean>(false);
	const [getAlertModalOpen, setAlertModalOpen] = createSignal<boolean>(false);
	const [getConfirmationModalOpen, setConfirmationModalOpen] =
		createSignal<boolean>(false);

	// ----------------------------------------
	// Render
	return (
		<Layout.Wrapper
			slots={{
				header: (
					<Headers.Standard
						copy={{
							title: "Test Title",
							description: "Test Description",
						}}
					/>
				),
			}}
		>
			<div class="flex gap-2.5">
				<button
					type="button"
					onClick={() => setOpenPanel(true)}
					class="bg-secondary-base text-secondary-contrast h-10 px-2.5 rounded-md"
				>
					Open Panel
				</button>
				<button
					type="button"
					onClick={() => setAlertModalOpen(true)}
					class="bg-secondary-base text-secondary-contrast h-10 px-2.5 rounded-md"
				>
					Open Alert Modal
				</button>
				<button
					type="button"
					onClick={() => setConfirmationModalOpen(true)}
					class="bg-secondary-base text-secondary-contrast h-10 px-2.5 rounded-md"
				>
					Open Confirmation Modal
				</button>
			</div>
			<Panel.Root
				state={{
					open: getOpenPanel(),
					setOpen: setOpenPanel,
				}}
				copy={{
					title: "Create Page",
					description: "Create a new page for the collection.",
				}}
				langauge={{
					contentLocale: true,
				}}
				options={{
					padding: "30",
				}}
			>
				{() => <>hi</>}
			</Panel.Root>
			<Modal.Alert
				state={{
					open: getAlertModalOpen(),
					setOpen: setAlertModalOpen,
				}}
				copy={{
					title: "Alert Modal",
					description: "This is an alert modal",
				}}
			>
				<p>This is the content of the alert modal</p>
			</Modal.Alert>
			<Modal.Confirmation
				theme="danger"
				state={{
					open: getConfirmationModalOpen(),
					setOpen: setConfirmationModalOpen,
					isError: true,
					isLoading: true,
				}}
				copy={{
					title: "Confirmation Modal",
					description: "This is a confirmation modal",
					error: "This is an error",
				}}
				callbacks={{
					onConfirm: () => {
						setConfirmationModalOpen(false);
					},
					onCancel: () => {
						setConfirmationModalOpen(false);
					},
				}}
			/>
		</Layout.Wrapper>
	);
};

export default TestRoute;
