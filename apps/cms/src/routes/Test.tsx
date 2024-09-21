import T from "@/translations";
import { type Component, createSignal, Show } from "solid-js";
import useSearchParamsLocation from "@/hooks/useSearchParamsLocation";
import api from "@/services/api";
import Layout from "@/components/Groups/Layout";
import Headers from "@/components/Groups/Headers";
import PageContent from "@/components/Groups/PageContent";
import Alert from "@/components/Blocks/Alert";
import CreateUpdateMediaPanel from "@/components/Panels/Media/CreateUpdateMediaPanel";

const TestRoute: Component = () => {
	// ----------------------------------
	// Hooks & State
	const searchParams = useSearchParamsLocation(
		{
			filters: {
				title: {
					value: "",
					type: "text",
				},
				extension: {
					value: "",
					type: "text",
				},
				type: {
					value: "",
					type: "array",
				},
				mimeType: {
					value: "",
					type: "text",
				},
				key: {
					value: "",
					type: "text",
				},
			},
			sorts: {
				fileSize: undefined,
				title: undefined,
				width: undefined,
				height: undefined,
				mimeType: undefined,
				extension: undefined,
				createdAt: undefined,
				updatedAt: "desc",
			},
			pagination: {
				perPage: 20,
			},
		},
		{
			singleSort: true,
		},
	);
	const [getOpenCreateMediaPanel, setOpenCreateMediaPanel] =
		createSignal<boolean>(false);

	// ----------------------------------------
	// Queries / Mutations
	const settings = api.settings.useGetSettings({
		queryParams: {},
	});

	// ----------------------------------------
	// Render
	return (
		<Layout.Standard
			slots={{
				topBar: (
					<Show when={settings.data?.data.media.enabled === false}>
						<Alert
							style="layout"
							alerts={[
								{
									type: "warning",
									message: T()(
										"media_support_config_stategy_error",
									),
									show:
										settings.data?.data.media.enabled ===
										false,
								},
							]}
						/>
					</Show>
				),
				header: (
					<Headers.Standard
						copy={{
							title: T()("media_route_title"),
							description: T()("media_route_description"),
						}}
					/>
				),
			}}
		>
			<PageContent.MediaList
				state={{
					searchParams: searchParams,
					setOpenCreateMediaPanel: setOpenCreateMediaPanel,
				}}
			/>
			<CreateUpdateMediaPanel
				state={{
					open: getOpenCreateMediaPanel(),
					setOpen: setOpenCreateMediaPanel,
				}}
			/>
		</Layout.Standard>
	);
};

export default TestRoute;
