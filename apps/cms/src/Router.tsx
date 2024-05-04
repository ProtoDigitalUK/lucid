import type { Component } from "solid-js";
import { Router, Route } from "@solidjs/router";
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
			{/* Authenticated */}
			<Route path="/" component={MainLayout}>
				<Route path="/" component={DashboardRoute} />
				<Route path="/test" component={TestRoute} />
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
			<Route path="/" component={AuthRoutes}>
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
