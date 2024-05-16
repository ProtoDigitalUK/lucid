import T from "@/translations";
import { type Component, createMemo, createSignal } from "solid-js";
import type { SettingsResponse } from "@lucidcms/core/types";
import helpers from "@/utils/helpers";
import userStore from "@/store/userStore";
import contentLocaleStore from "@/store/contentLocaleStore";
import InfoRow from "@/components/Blocks/InfoRow";
import Button from "@/components/Partials/Button";
import ProgressBar from "@/components/Partials/ProgressBar";
import ClearAllProcessedImages from "@/components/Modals/Media/ClearAllProcessedImages";
import DetailsList from "@/components/Partials/DetailsList";

interface GeneralSettingsRouteProps {
	settings?: SettingsResponse;
}

const GeneralSettingsRoute: Component<GeneralSettingsRouteProps> = (props) => {
	// ----------------------------------------
	// State / Hooks
	const [getOpenClearAllProcessedImages, setOpenClearAllProcessedImages] =
		createSignal(false);

	// ----------------------------------------
	// Memos
	const percentUsed = createMemo(() => {
		if (props.settings?.media.storage.remaining === null) return 0;
		if (props.settings?.media.storage.used === 0) return 0;
		const total = props.settings?.media.storage.limit || 0;
		const remaining = props.settings?.media.storage.remaining || 0;

		return Math.floor(((total - remaining) / total) * 100);
	});
	const locales = createMemo(() => contentLocaleStore.get.locales);

	// ----------------------------------------
	// Render
	return (
		<>
			<InfoRow.Root
				title={T("processed_images")}
				description={T("processed_images_setting_message", {
					limit: props.settings?.media.processed.imageLimit || 0,
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
							count: props.settings?.media.processed.total || 0,
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
							props.settings?.media.storage.remaining,
						),
					})}
				>
					<ProgressBar
						progress={percentUsed()}
						type="usage"
						labels={{
							start: helpers.bytesToSize(
								props.settings?.media.storage.used,
							),
							end: helpers.bytesToSize(
								props.settings?.media.storage.limit,
							),
						}}
					/>
				</InfoRow.Content>
			</InfoRow.Root>

			<InfoRow.Root
				title={T("supported_features")}
				description={T("supported_features_setting_message")}
			>
				<InfoRow.Content>
					<DetailsList
						type="pill"
						items={[
							{
								label: T("media_enabled"),
								value: props.settings?.media.enabled
									? T("yes")
									: T("no"),
							},
							{
								label: T("email_enabled"),
								value: props.settings?.email.enabled
									? T("yes")
									: T("no"),
							},
						]}
					/>
				</InfoRow.Content>
			</InfoRow.Root>

			<InfoRow.Root
				title={T("supported_locales")}
				description={T("supported_locales_setting_message")}
			>
				<InfoRow.Content>
					<DetailsList
						type="text"
						items={
							locales().map((locale) => ({
								label: locale.name || locale.code,
								value: `${locale.code} ${
									locale.isDefault === 1
										? `(${T("default")})`
										: ""
								} `,
							})) || []
						}
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
