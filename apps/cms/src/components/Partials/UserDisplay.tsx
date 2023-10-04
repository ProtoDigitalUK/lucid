import { Component, Switch, Match } from "solid-js";
// Utils
import helpers from "@/utils/helpers";

interface UserDisplayProps {
  user: {
    username: string;
    first_name?: string | null;
    last_name?: string | null;
    thumbnail?: string;
  };
  mode: "short" | "long";
}

const UserDisplay: Component<UserDisplayProps> = (props) => {
  // ----------------------------------
  // Render
  return (
    <div class="flex items-center">
      <span class="h-8 w-8 min-w-[32px] rounded-full flex bg-primary text-primaryText justify-center items-center text-xs font-bold mr-2.5">
        {helpers.formatUserInitials({
          first_name: props.user.first_name,
          last_name: props.user.last_name,
          username: props.user.username,
        })}
      </span>
      <Switch>
        <Match when={props.mode === "short"}>{props.user.username}</Match>
        <Match when={props.mode === "long"}>
          {helpers.formatUserName({
            username: props.user.username,
            first_name: props.user.first_name,
            last_name: props.user.last_name,
          })}
        </Match>
      </Switch>
    </div>
  );
};

export default UserDisplay;