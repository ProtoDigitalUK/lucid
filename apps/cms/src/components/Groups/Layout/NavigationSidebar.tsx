import T from "@/translations";
import type { Component } from "solid-js";
import LogoIcon from "@/assets/svgs/logo-icon.svg";
import userStore from "@/store/userStore";
import Navigation from "@/components/Groups/Navigation";

export const NavigationSidebar: Component = () => {
	// ----------------------------------
	// Render
	return (
		<div class="h-full flex ">
			{/* Mainbar */}
			<nav class="bg-container-1 w-[70px] h-full flex items-center flex-col border-r border-border overflow-y-auto max-h-screen">
				<div class="h-[60px] min-h-[70px] flex items-center justify-center">
					<img src={LogoIcon} alt="logo" class="size-6" />
				</div>
				<ul class="pb-15">
					<Navigation.IconLink
						href="/"
						icon="dashboard"
						title={T()("home")}
					/>
					<Navigation.IconLink
						href="/collections"
						icon="collection"
						title={T()("collections")}
					/>
					<Navigation.IconLink
						href="/media"
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
						href="/users"
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
						href="/roles"
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
						href="/emails"
						icon="email"
						title={T()("emails")}
						permission={
							userStore.get.hasPermission(["read_email"]).all
						}
					/>
					<Navigation.IconLink
						href="/settings"
						icon="settings"
						title={T()("settings")}
					/>
				</ul>
			</nav>
		</div>
	);
};
