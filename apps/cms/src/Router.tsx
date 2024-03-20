import type { Component } from "solid-js";
import { Router, Routes, Route } from "@solidjs/router";
// Layouts
import AuthRoutes from "@/layouts/AuthRoutes";
import MainLayout from "@/layouts/Main";

// ------------------------------------------------------
// Routes

// root
import LoginRoute from "@/routes/Login";
import ForgotPasswordRoute from "@/routes/ForgotPassword";
import ResetPasswordRoute from "@/routes/ResetPassword";
import DashboardRoute from "@/routes/Dashboard";
import TestRoute from "@/routes/Test";

// media
import MediaListRoute from "@/routes/Media/List";

// users
import UsersListRoute from "@/routes/Users/List";

// roles
import RolesListRoute from "@/routes/Roles/List";

// settings
import SettingsListRoute from "@/routes/Settings/List";

// emails
import EmailListRoute from "@/routes/Emails/List";

// collections
import CollectionsMultiplePageListRoute from "@/routes/Collections/MultiplePage/List";
import CollectionsMultiplePagesEditRoute from "@/routes/Collections/MultiplePage/Edit";
import CollectionsSinglePageEditRoute from "./routes/Collections/SinglePage/Edit";

const AppRouter: Component = () => {
	return (
		<Router>
			<Routes>
				{/* Authenticated */}
				<Route path="/" element={<MainLayout />}>
					<Route path="/" element={<DashboardRoute />} />
					<Route path="/test" element={<TestRoute />} />
					{/* Environments */}
					<Route
						path="/collection/:collectionKey/multiple"
						element={<CollectionsMultiplePageListRoute />}
					/>
					<Route
						path="/collection/:collectionKey/multiple/:id"
						element={<CollectionsMultiplePagesEditRoute />}
					/>
					<Route
						path={"/collection/:collectionKey/single"}
						element={<CollectionsSinglePageEditRoute />}
					/>
					{/* Media */}
					<Route path="/media" element={<MediaListRoute />} />
					{/* Users */}
					<Route path="/users" element={<UsersListRoute />} />
					{/* Roles */}
					<Route path="/roles" element={<RolesListRoute />} />
					{/* Emails */}
					<Route path="/emails" element={<EmailListRoute />} />
					{/* Settings */}
					<Route path="/settings" element={<SettingsListRoute />} />
					<Route
						path="/settings/integrations"
						element={<SettingsListRoute />}
					/>
				</Route>
				{/* Non authenticated */}
				<Route path="/" component={AuthRoutes}>
					<Route path="/login" component={LoginRoute} />
					<Route
						path="/forgot-password"
						component={ForgotPasswordRoute}
					/>
					<Route
						path="/reset-password"
						component={ResetPasswordRoute}
					/>
				</Route>
			</Routes>
		</Router>
	);
};

export default AppRouter;
