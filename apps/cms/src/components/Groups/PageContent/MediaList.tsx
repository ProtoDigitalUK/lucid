import type { Component, JSXElement } from "solid-js";
import type useSearchParamsLocation from "@/hooks/useSearchParamsLocation";
import Content from "@/components/Groups/Content";
import Footers from "@/components/Groups/Footers";

export const MediaList: Component<{
	state: {
		searchParams: ReturnType<typeof useSearchParamsLocation>;
		setOpenCreateMediaPanel: (state: boolean) => void;
	};
}> = (props) => {
	// ----------------------------------------
	// Render
	return (
		<Content.Dynamic slot={{ footer: <Footers.Paginated /> }}>
			<h1>Content</h1>
			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
			ipsum magna, aliquet in laoreet vitae, suscipit sed nulla. Cras
			sagittis enim eu dolor iaculis aliquet. Donec viverra aliquam
			consectetur. Morbi a erat aliquet, molestie elit vitae, mattis diam.
			Ut ut malesuada eros. Praesent hendrerit id dui eu hendrerit. Sed
			convallis elit non nulla volutpat pellentesque ut eu nibh. Nulla
			rutrum, mauris eu venenatis accumsan, lacus sapien venenatis massa,
			vel molestie libero turpis vel elit. Sed blandit augue quam, id
			ullamcorper velit hendrerit eget. In euismod suscipit arcu vel
			pellentesque. Integer pulvinar auctor gravida. Pellentesque iaculis
			ligula eu lectus molestie dignissim. In vestibulum sapien eget
			laoreet mattis. Ut pellentesque efficitur dui, ut ultricies quam. Ut
			eget metus eget tellus posuere egestas vel sit amet leo. Duis
			venenatis lorem ac tincidunt iaculis. Praesent in tincidunt nisl.
			Aenean varius velit et lorem finibus ultricies. Duis viverra elit
			volutpat, malesuada nisi quis, cursus leo. Phasellus euismod velit
			sit amet velit posuere, sed bibendum elit ultricies. Fusce ultrices
			lorem ante, nec pharetra dui scelerisque et. Vestibulum ante ipsum
			primis in faucibus orci luctus et ultrices posuere cubilia curae;
			Vivamus consequat velit ante. Aliquam accumsan efficitur tincidunt.
			Donec et nisi felis. Interdum et malesuada fames ac ante ipsum
			primis in faucibus. Sed sit amet mi neque. Nam tincidunt ex vel
			nulla malesuada pulvinar. Nullam magna orci, mollis in posuere sit
			amet, congue vitae diam. Curabitur dignissim laoreet neque, at
			rutrum ex feugiat eu. Fusce ut dolor enim. Sed ultricies ac leo nec
			gravida. Etiam dapibus est mauris, nec finibus orci rutrum in. Sed
			dignissim vitae elit tristique viverra. Sed in augue a nisl
			fringilla porttitor. Donec pulvinar feugiat nisi non elementum.
			Fusce dapibus eu sem ut finibus. Etiam quis molestie lectus. Sed eu
			lacus et felis pulvinar tempor id ac metus. Nulla felis lacus,
			mattis a mollis ac, molestie quis lacus. Maecenas eu nisi a urna
			rhoncus laoreet. Sed accumsan diam odio, a dapibus erat elementum
			sit amet. Donec porttitor libero eu purus porttitor, a feugiat nisi
			blandit. Suspendisse in hendrerit arcu, eu semper est. Morbi gravida
			hendrerit quam, nec consectetur metus placerat et. Etiam sodales
			elit diam, eget rhoncus nisl scelerisque vitae. Sed felis ipsum,
			ornare eu pulvinar tempus, consectetur commodo nunc. Quisque
			convallis sapien odio, sed bibendum lectus suscipit at. Aenean
			venenatis lorem ex, sit amet facilisis est commodo feugiat. Quisque
			tristique mattis ligula in porta. Class aptent taciti sociosqu ad
			litora torquent per conubia nostra, per inceptos himenaeos. Etiam
			bibendum sapien ex, accumsan tristique lacus aliquet sed. Duis
			tempor lacus a neque convallis ornare. Curabitur tristique dui ac
			arcu euismod, non cursus nisi volutpat. Phasellus vel congue odio.
			Vestibulum sed elit quis diam volutpat vulputate. Nullam porttitor
			lectus nec feugiat pulvinar.
		</Content.Dynamic>
	);
};
