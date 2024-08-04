export interface PluginOptions {
	collections: Array<{
		key: string;
		homepage?: boolean;
		slug?: {
			prefix?: string;
			translations?: boolean;
		};
	}>;
}

export interface PluginOptionsInternal extends PluginOptions {
	collections: Array<CollectionConfig>;
}

export interface CollectionConfig {
	key: string;
	homepage: boolean;
	slug: {
		prefix: string | null;
		translations: boolean;
	};
}
