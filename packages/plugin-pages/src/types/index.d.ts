export interface PluginOptions {
	collections: Array<{
		key: string;
		translations?: boolean;
	}>;
}

export interface PluginOptionsInternal extends PluginOptions {
	collections: Array<CollectionConfig>;
}

export interface CollectionConfig {
	key: string;
	translations: boolean;
}
