import { type Component, Switch, Match, type JSXElement } from "solid-js";
import { Navigate } from "@solidjs/router";

interface AuthenticatedProps {
	requiredState?: boolean;
	children: JSXElement;
}

const Authenticated: Component<AuthenticatedProps> = (props) => {
	// ----------------------------------------
	// Render
	return props.children;
};

export default Authenticated;
