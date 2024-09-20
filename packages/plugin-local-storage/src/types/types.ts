export interface PluginOptions {
	/** The directory where the files will be uploaded */
	uploadDir: string;
	/** The secret key used to sign the URLs */
	secretKey: string;
	/** Provide a list of mime types that the upload service supports */
	supportedMimeTypes?: string[];
}
