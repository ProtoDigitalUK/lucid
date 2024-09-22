import { type Component, createSignal } from "solid-js";
import Headers from "@/components/Groups/Headers";
import Layout from "@/components/Groups/Layout";
import Panel from "@/components/Groups/Panel";

const TestRoute: Component = () => {
	// ----------------------------------
	// State
	const [getOpenPanel, setOpenPanel] = createSignal<boolean>(false);

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
			<button type="button" onClick={() => setOpenPanel(true)}>
				Open Panel
			</button>
			<Panel.Root
				open={getOpenPanel()}
				setOpen={setOpenPanel}
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
		</Layout.Wrapper>
	);
};

export default TestRoute;
