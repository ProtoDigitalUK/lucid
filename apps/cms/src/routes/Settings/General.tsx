import T from "@/translations";
import { type Component, createMemo, createSignal } from "solid-js";
// Utils
import helpers from "@/utils/helpers";
// Store
import userStore from "@/store/userStore";
// Components
import InfoRow from "@/components/Blocks/InfoRow";
import Button from "@/components/Partials/Button";
import ProgressBar from "@/components/Partials/ProgressBar";
import ClearAllProcessedImages from "@/components/Modals/Media/ClearAllProcessedImages";
// Types
import type { SettingsResT } from "@headless/types/src/settings";

interface GeneralSettingsRouteProps {
	settings?: SettingsResT;
}

const GeneralSettingsRoute: Component<GeneralSettingsRouteProps> = (props) => {
	// ----------------------------------------
	// State / Hooks
	const [getOpenClearAllProcessedImages, setOpenClearAllProcessedImages] =
		createSignal(false);

	// ----------------------------------------
	// Memos
	const percentUsed = createMemo(() => {
		if (props.settings?.media.storage_remaining === null) return 0;
		if (props.settings?.media.storage_used === 0) return 0;
		const total = props.settings?.media.storage_limit || 0;
		const remaining = props.settings?.media.storage_remaining || 0;

		return Math.floor(((total - remaining) / total) * 100);
	});

	// ----------------------------------------
	// Render
	return (
		<>
			<InfoRow.Root
				title={T("processed_images")}
				description={T("processed_images_setting_message", {
					limit:
						props.settings?.media.processed_images
							.per_image_limit || 0,
				})}
			>
				<InfoRow.Content
					title={T("clear_all")}
					description={T(
						"clear_all_processed_images_setting_message",
					)}
				>
					<Button
						size="small"
						type="button"
						theme="danger"
						onClick={() => {
							setOpenClearAllProcessedImages(true);
						}}
						permission={
							userStore.get.hasPermission(["update_media"]).all
						}
					>
						{T("clear_all_processed_images_button", {
							count:
								props.settings?.media.processed_images.total ||
								0,
						})}
					</Button>
				</InfoRow.Content>
			</InfoRow.Root>
			<InfoRow.Root
				title={T("storage_breakdown")}
				description={T("storage_breakdown_setting_message")}
			>
				<InfoRow.Content
					title={T("storage_remaining_title", {
						storage: helpers.bytesToSize(
							props.settings?.media.storage_remaining,
						),
					})}
				>
					<ProgressBar
						progress={percentUsed()}
						type="usage"
						labels={{
							start: helpers.bytesToSize(
								props.settings?.media.storage_used,
							),
							end: helpers.bytesToSize(
								props.settings?.media.storage_limit,
							),
						}}
					/>
				</InfoRow.Content>
			</InfoRow.Root>

			{/* Modals */}
			<ClearAllProcessedImages
				state={{
					open: getOpenClearAllProcessedImages(),
					setOpen: setOpenClearAllProcessedImages,
				}}
			/>
		</>
	);
};

export default GeneralSettingsRoute;
