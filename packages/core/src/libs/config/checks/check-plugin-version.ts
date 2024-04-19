import T from "../../../translations/index.js";
import { HeadlessError } from "../../../utils/error-handler.js";
import packageJson from "../../../../package.json";
import semver from "semver";

const checkPluginVersion = (data: {
	key: string;
	requiredVersions: string;
	headlessVersion?: string;
}) => {
	const useVersion = data.headlessVersion ?? packageJson.version;
	const headlessVersion = semver.coerce(useVersion) ?? useVersion;

	if (!semver.satisfies(headlessVersion, data.requiredVersions)) {
		throw new HeadlessError({
			scope: data.key,
			message: T("plugin_version_not_supported", {
				version: headlessVersion as string,
				supportedVersions: data.requiredVersions,
			}),
		});
	}
};

export default checkPluginVersion;
