import { type Component, Switch, Match } from "solid-js";
import helpers from "@/utils/helpers";

interface UserDisplayProps {
	user: {
		username: string;
		firstName?: string | null;
		lastName?: string | null;
		thumbnail?: string;
	};
	mode: "short" | "long";
}

const UserDisplay: Component<UserDisplayProps> = (props) => {
	// ----------------------------------
	// Render
	return (
		<div class="flex items-center">
			<span class="h-8 w-8 min-w-[32px] rounded-full flex bg-primary-base text-primary-contrast justify-center items-center text-xs font-bold mr-2.5">
				{helpers.formatUserInitials({
					firstName: props.user.firstName,
					lastName: props.user.lastName,
					username: props.user.username,
				})}
			</span>
			<Switch>
				<Match when={props.mode === "short"}>
					{props.user.username}
				</Match>
				<Match when={props.mode === "long"}>
					{helpers.formatUserName({
						username: props.user.username,
						firstName: props.user.firstName,
						lastName: props.user.lastName,
					})}
				</Match>
			</Switch>
		</div>
	);
};

export default UserDisplay;
