import type { Component } from "solid-js";
import { Router, Routes, Route } from "@solidjs/router";
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
import CollectionsListRoute from "@/routes/Collections/List";
import CollectionsDocumentsListRoute from "./routes/Collections/Documents/List";
import CollectionsDocumentsEditRoute from "./routes/Collections/Documents/Edit";
// import CollectionsMultipleBuildereListRoute from "@/routes/Collections/MultipleBuilder/List";
// import CollectionsMultipleBuilderEditRoute from "@/routes/Collections/MultipleBuilder/Edit";
// import CollectionsSingleBuilderEditRoute from "./routes/Collections/SingleBuilder/Edit";

const AppRouter: Component = () => {
	return (
		<Router>
			<Routes>
				{/* Authenticated */}
				<Route path="/" element={<MainLayout />}>
					<Route path="/" element={<DashboardRoute />} />
					<Route path="/test" element={<TestRoute />} />
					{/* Collections */}
					<Route
						path="/collections"
						element={<CollectionsListRoute />}
					/>
					<Route
						path="/collections/:collectionKey"
						element={<CollectionsDocumentsListRoute />}
					/>
					<Route
						path="/collections/:collectionKey/create"
						element={
							<CollectionsDocumentsEditRoute mode="create" />
						}
					/>
					<Route
						path="/collections/:collectionKey/:documentId"
						element={<CollectionsDocumentsEditRoute mode="edit" />}
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
