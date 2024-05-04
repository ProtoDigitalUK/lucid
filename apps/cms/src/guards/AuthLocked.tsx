import { type Component, Switch, Match, type JSXElement } from "solid-js";
import { Navigate } from "@solidjs/router";
import { getCookie } from "@/utils/cookie";

interface AuthLockedProps {
	children: JSXElement;
}

const AuthLocked: Component<AuthLockedProps> = (props) => {
	// ----------------------------------------
	// Render
	return (
		<Switch fallback={props.children}>
			<Match when={getCookie("auth")}>
				<Navigate href="/" />
			</Match>
		</Switch>
	);
};

export default AuthLocked;
