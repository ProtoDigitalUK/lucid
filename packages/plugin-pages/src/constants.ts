export const PLUGIN_KEY = "plugin-pages";
export const LUCID_VERSION = "0.x.x";

export default {
	collectionFieldBrickId: "collection-pseudo-brick",
	// safeguard against infinite loops - also max acts as max parent depth
	maxHierarchyDepth: 1000,
	fields: {
		parentPage: {
			key: "parentPage",
		},
		slug: {
			key: "slug",
		},
		fullSlug: {
			key: "fullSlug",
		},
	},
};
