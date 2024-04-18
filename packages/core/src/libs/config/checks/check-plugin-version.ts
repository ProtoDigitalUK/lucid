import T from "../../../translations/index.js";
import { HeadlessError } from "../../../utils/error-handler.js";
import packageJson from "../../../../package.json";
import semver from "semver";

const checkPluginVersion = (data: {
	key: string;
	requiredVersions: string;
	headlessVersion?: string;
}) => {
	const headlessVersion = data.headlessVersion ?? packageJson.version;

	if (!semver.satisfies(headlessVersion, data.requiredVersions)) {
		throw new HeadlessError({
			scope: data.key,
			message: T("plugin_version_not_supported", {
				version: headlessVersion,
				supportedVersions: data.requiredVersions,
			}),
		});
	}
};

export default checkPluginVersion;
