import T from "@/translations";
import {
	type Component,
	createMemo,
	createSignal,
	createEffect,
} from "solid-js";
import linkFieldStore from "@/store/linkFieldStore";
import Modal from "@/components/Groups/Modal";
import Form from "@/components/Groups/Form";
import Button from "@/components/Partials/Button";

const LinkSelect: Component = () => {
	// ------------------------------
	// State
	const [getLabel, setLabel] = createSignal<string>("");
	const [getUrl, setUrl] = createSignal<string>("");
	const [getOpenInNewTab, setOpenInNewTab] = createSignal<boolean>(false);

	// ----------------------------------
	// Memos
	const open = createMemo(() => linkFieldStore.get.open);
	const selectedLink = createMemo(() => linkFieldStore.get.selectedLink);

	// ----------------------------------
	// Functions
	const updateLink = () => {
		linkFieldStore.get.onSelectCallback({
			url: getUrl(),
			target: getOpenInNewTab() ? "_blank" : "_self",
			label: getLabel(),
		});
		linkFieldStore.set("open", false);
	};

	// ----------------------------------
	// Effects
	createEffect(() => {
		setLabel(selectedLink()?.label || "");
		setOpenInNewTab(selectedLink()?.target === "_blank");
		setUrl(selectedLink()?.url || "");
	});

	// ------------------------------
	// Render
	return (
		<Modal.Root
			state={{
				open: open(),
				setOpen: () => linkFieldStore.set("open", false),
			}}
			options={{
				noPadding: true,
			}}
		>
			<div class="p-15">
				<div class="mb-15 pb-15 border-b border-border">
					<h2>{T("set_page_link")}</h2>
				</div>
				<div class="mb-15 pb-15 border-b border-border">
					<Form.Input
						id="label"
						value={getLabel()}
						onChange={(value) => setLabel(value)}
						name={"label"}
						type="text"
						copy={{
							label: T("label"),
						}}
						required={false}
						theme={"basic"}
					/>
					<Form.Input
						id="url"
						value={getUrl()}
						onChange={(value) => setUrl(value)}
						name={"url"}
						type="text"
						copy={{
							label: T("url"),
						}}
						required={false}
						theme={"basic"}
					/>
					<Form.Checkbox
						id="open_in_new_tab"
						value={getOpenInNewTab()}
						onChange={(value) => setOpenInNewTab(value)}
						name={"open_in_new_tab"}
						copy={{
							label: T("open_in_new_tab"),
						}}
						required={false}
						theme={"basic"}
					/>
				</div>

				<div class="w-full flex justify-between mt-15">
					<Button
						type="button"
						theme="container-outline"
						size="x-small"
						onClick={() => {
							linkFieldStore.set("open", false);
						}}
					>
						{T("cancel")}
					</Button>
					<Button
						type="button"
						theme="primary"
						size="x-small"
						onClick={updateLink}
					>
						{T("update")}
					</Button>
				</div>
			</div>
		</Modal.Root>
	);
};

export default LinkSelect;
