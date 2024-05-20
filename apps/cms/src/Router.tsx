import type { Component } from "solid-js";
import { Router, Route } from "@solidjs/router";
import AuthRoutes from "@/layouts/AuthRoutes";
import MainLayout from "@/layouts/Main";
// Routes
import LoginRoute from "@/routes/Login";
import ForgotPasswordRoute from "@/routes/ForgotPassword";
import ResetPasswordRoute from "@/routes/ResetPassword";
import DashboardRoute from "@/routes/Dashboard";
import MediaListRoute from "@/routes/Media/List";
import UsersListRoute from "@/routes/Users/List";
import RolesListRoute from "@/routes/Roles/List";
import SettingsListRoute from "@/routes/Settings/List";
import EmailListRoute from "@/routes/Emails/List";
import AccountRoute from "@/routes/Account";
import CollectionsListRoute from "@/routes/Collections/List";
import CollectionsDocumentsListRoute from "./routes/Collections/Documents/List";
import CollectionsDocumentsEditRoute from "./routes/Collections/Documents/Edit";

const AppRouter: Component = () => {
	return (
		<Router>
			{/* Authenticated */}
			<Route path="/admin" component={MainLayout}>
				<Route path="/" component={DashboardRoute} />
				<Route path="/account" component={AccountRoute} />
				{/* Collections */}
				<Route path="/collections" component={CollectionsListRoute} />
				<Route
					path="/collections/:collectionKey"
					component={CollectionsDocumentsListRoute}
				/>
				<Route
					path="/collections/:collectionKey/create"
					component={() => (
						<CollectionsDocumentsEditRoute mode="create" />
					)}
				/>
				<Route
					path="/collections/:collectionKey/:documentId"
					component={() => (
						<CollectionsDocumentsEditRoute mode="edit" />
					)}
				/>
				{/* Media */}
				<Route path="/media" component={MediaListRoute} />
				{/* Users */}
				<Route path="/users" component={UsersListRoute} />
				{/* Roles */}
				<Route path="/roles" component={RolesListRoute} />
				{/* Emails */}
				<Route path="/emails" component={EmailListRoute} />
				{/* Settings */}
				<Route path="/settings" component={SettingsListRoute} />
				<Route
					path="/settings/integrations"
					component={SettingsListRoute}
				/>
			</Route>
			{/* Non authenticated */}
			<Route path="/admin" component={AuthRoutes}>
				<Route path="/login" component={LoginRoute} />
				<Route
					path="/forgot-password"
					component={ForgotPasswordRoute}
				/>
				<Route path="/reset-password" component={ResetPasswordRoute} />
			</Route>
		</Router>
	);
};

export default AppRouter;
