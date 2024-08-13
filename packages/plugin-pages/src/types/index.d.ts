export interface PluginOptions {
	collections: Array<{
		key: string;
		translations?: boolean;
		showFullSlug?: boolean;
	}>;
}

export interface PluginOptionsInternal extends PluginOptions {
	collections: Array<CollectionConfig>;
}

export interface CollectionConfig {
	key: string;
	translations: boolean;
	showFullSlug: boolean;
}
