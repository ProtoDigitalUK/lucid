import { type Component, Switch, Match } from "solid-js";
import { Navigate, Outlet } from "@solidjs/router";
import { getCookie } from "@/utils/cookie";

interface AuthenticatedProps {
	requiredState?: boolean;
}

const Authenticated: Component<AuthenticatedProps> = () => {
	// ----------------------------------------
	// Render
	return <Outlet />;
	// return (
	// <Switch fallback={<Outlet />}>
	// 	<Match when={!getCookie("auth")}>
	// 		{/* <Navigate href="/login" /> */}
	// 	</Match>
	// </Switch>
	// );
};

export default Authenticated;
