export interface PluginOptions {
	collections: Array<{
		key: string;
		slug?: {
			// prefix?: string;
			translations?: boolean;
		};
	}>;
}

export interface PluginOptionsInternal extends PluginOptions {
	collections: Array<CollectionConfig>;
}

export interface CollectionConfig {
	key: string;
	slug: {
		// prefix: string | null;
		translations: boolean;
	};
}
