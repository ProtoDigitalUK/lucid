import T from "@/translations";
import {
	type Component,
	createMemo,
	Show,
	createSignal,
	Switch,
	Match,
} from "solid-js";
import api from "@/services/api";
import packageJson from "../../../../../../packages/core/package.json";
import { A } from "@solidjs/router";
import LogoIcon from "@/assets/svgs/logo-icon.svg";
import userStore from "@/store/userStore";
import Navigation from "@/components/Groups/Navigation";
import UserDisplay from "@/components/Partials/UserDisplay";
import SubMenus from "@/components/Groups/Navigation/SubMenus";

export const NavigationSidebar: Component = () => {
	// ----------------------------------------
	// Mutations
	const logout = api.auth.useLogout();
	const user = createMemo(() => userStore.get.user);

	// ----------------------------------
	// Render
	return (
		<nav class="bg-container-1 max-h-screen flex relative">
			{/* Primary */}
			<div class="w-[70px] h-full flex items-center justify-between flex-col border-r border-border overflow-y-auto ">
				<div>
					<div class="h-[60px] min-h-[70px] flex items-center justify-center">
						<img src={LogoIcon} alt="logo" class="size-6" />
					</div>
					<ul class="pb-15">
						<Navigation.IconLink
							type="link"
							href="/admin"
							icon="dashboard"
							title={T()("home")}
						/>
						<Navigation.IconLink
							type="link"
							icon="collection"
							title={T()("collections")}
							href="/admin/collections"
						/>
						<Navigation.IconLink
							type="link"
							href="/admin/media"
							icon="media"
							title={T()("media")}
							permission={
								userStore.get.hasPermission([
									"create_media",
									"update_media",
									"delete_media",
								]).some
							}
						/>
						<Navigation.IconLink
							type="link"
							href="/admin/users"
							icon="users"
							title={T()("users")}
							permission={
								userStore.get.hasPermission([
									"create_user",
									"update_user",
									"delete_user",
								]).some
							}
						/>
						<Navigation.IconLink
							type="link"
							href="/admin/roles"
							icon="roles"
							title={T()("roles")}
							permission={
								userStore.get.hasPermission([
									"create_role",
									"update_role",
									"delete_role",
								]).some
							}
						/>
						<Navigation.IconLink
							type="link"
							href="/admin/emails"
							icon="email"
							title={T()("emails")}
							permission={
								userStore.get.hasPermission(["read_email"]).all
							}
						/>
						<Navigation.IconLink
							type="link"
							href="/admin/settings"
							icon="settings"
							title={T()("settings")}
						/>
					</ul>
				</div>
				<div class="pb-15">
					<ul class="flex flex-col items-center">
						<Navigation.IconLink
							type="button"
							icon="logout"
							loading={logout.action.isPending}
							onClick={() => logout.action.mutate({})}
							title={T()("logout")}
						/>
						<Show when={user()}>
							<li>
								<A
									href="/admin/account"
									class="flex items-center justify-center"
								>
									<UserDisplay
										user={{
											username: user()?.username || "",
											firstName: user()?.firstName,
											lastName: user()?.lastName,
											thumbnail: undefined,
										}}
										mode="icon"
									/>
								</A>
							</li>
						</Show>
					</ul>
					<small class="text-[6px] leading-none">
						v{packageJson.version}
					</small>
				</div>
			</div>
			{/* SUbMenus */}
			<SubMenus.Collections />
		</nav>
	);
};
