import { type Component, Switch, Match, type JSXElement } from "solid-js";
import { Navigate } from "@solidjs/router";
import { getCookie } from "@/utils/cookie";

interface AuthenticatedProps {
	requiredState?: boolean;
	children: JSXElement;
}

const Authenticated: Component<AuthenticatedProps> = (props) => {
	// ----------------------------------------
	// Render
	return props.children;
	// return (
	// <Switch fallback={<Outlet />}>
	// 	<Match when={!getCookie("auth")}>
	// 		{/* <Navigate href="/login" /> */}
	// 	</Match>
	// </Switch>
	// );
};

export default Authenticated;
