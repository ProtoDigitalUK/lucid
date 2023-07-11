import { PermissionT, EnvironmentPermissionT, PermissionUsers, PermissionRoles, PermissionMedia, PermissionSettings, PermissionEnvironment, PermissionEmails, PermissionContent, PermissionCategory, PermissionMenu, PermissionFormSubmissions } from "../permissions";
export default class Permissions {
    static get formattedPermissions(): {
        global: {
            users: {
                title: string;
                permissions: PermissionUsers[];
            };
            roles: {
                title: string;
                permissions: PermissionRoles[];
            };
            media: {
                title: string;
                permissions: PermissionMedia[];
            };
            settings: {
                title: string;
                permissions: "update_settings"[];
            };
            environment: {
                title: string;
                permissions: PermissionEnvironment[];
            };
            emails: {
                title: string;
                permissions: PermissionEmails[];
            };
        };
        environment: {
            content: {
                title: string;
                permissions: PermissionContent[];
            };
            category: {
                title: string;
                permissions: PermissionCategory[];
            };
            menu: {
                title: string;
                permissions: PermissionMenu[];
            };
            form_submissions: {
                title: string;
                permissions: PermissionFormSubmissions[];
            };
        };
    };
    static get permissions(): {
        global: PermissionT[];
        environment: EnvironmentPermissionT[];
    };
    static get userPermissions(): PermissionUsers[];
    static get rolePermissions(): PermissionRoles[];
    static get mediaPermissions(): PermissionMedia[];
    static get settingsPermissions(): PermissionSettings[];
    static get environmentPermissions(): PermissionEnvironment[];
    static get emailPermissions(): PermissionEmails[];
    static get contentPermissions(): PermissionContent[];
    static get categoryPermissions(): PermissionCategory[];
    static get menuPermissions(): PermissionMenu[];
    static get formSubmissionsPermissions(): PermissionFormSubmissions[];
}
//# sourceMappingURL=Permissions.d.ts.map