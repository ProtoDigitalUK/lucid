const formatPermissions = (permissions) => {
    return {
        global: [
            permissions.users,
            permissions.roles,
            permissions.media,
            permissions.settings,
            permissions.environment,
            permissions.emails,
        ],
        environment: [
            permissions.content,
            permissions.category,
            permissions.menu,
            permissions.form_submissions,
        ],
    };
};
export default formatPermissions;
//# sourceMappingURL=format-permissions.js.map