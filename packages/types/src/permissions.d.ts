export type PermissionT =
	| "create_user"
	| "update_user"
	| "delete_user"
	| "create_role"
	| "update_role"
	| "delete_role"
	| "create_media"
	| "update_media"
	| "delete_media"
	| "update_settings"
	| "read_email"
	| "delete_email"
	| "send_email"
	| "create_language"
	| "update_language"
	| "delete_language"
	| "create_content"
	| "update_content"
	| "delete_content"
	| "publish_content"
	| "unpublish_content"
	| "create_menu"
	| "update_menu"
	| "delete_menu"
	| "delete_collection"
	| "create_collection"
	| "update_collection"
	| "create_category"
	| "update_category"
	| "delete_category"
	| "read_form_submissions"
	| "delete_form_submissions"
	| "update_form_submissions";

export type PermissionGroup = {
	key: string;
	permissions: PermissionT[];
};
