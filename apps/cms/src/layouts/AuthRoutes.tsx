import type { Component, JSXElement } from "solid-js";
import LogoIcon from "@/assets/svgs/logo-icon.svg";

interface AuthRoutesProps {
	children?: JSXElement;
}

const AuthRoutes: Component<AuthRoutesProps> = (props) => {
	// ----------------------------------
	// Render
	return (
		<div class="fixed top-0 left-0 bottom-0 right-0 flex ">
			<div class="w-full h-full bg-container-3 overflow-y-auto flex items-center justify-center relative">
				<div class="m-auto px-10 py-20 w-full max-w-[600px] ">
					<img
						src={LogoIcon}
						alt="logo"
						class="size-10 mx-auto mb-30"
					/>
					{props.children}
				</div>
			</div>
		</div>
	);
};

export default AuthRoutes;
