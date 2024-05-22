import projectPackage from "../../../package.json";
import constants from "../../constants.js";
import getConfig from "../config/get-config.js";

const bgYellow = "\x1b[43m";
const textYellow = "\x1b[33m";
const textGreen = "\x1b[32m";
const textBlue = "\x1b[34m";
const reset = "\x1b[0m";

const serverStartLog = async (address: string, start: [number, number]) => {
	const config = await getConfig();
	const loadTime = Math.round(process.hrtime(start)[1] / 1000000);

	console.log("");
	console.log(
		`${bgYellow} LUCID CMS ${reset} ${textYellow}v${projectPackage.version}${reset} ready in ${textGreen}${loadTime} ms\n${reset}`,
	);

	console.log(`┃ Lucid Admin      ${textBlue}${address}/admin${reset}`);
	console.log(`┃ Environment      ${textBlue}${config.mode}${reset}`);
	console.log(
		`┃ Documentation    ${textBlue}${constants.documentation}${reset}`,
	);

	console.log("");
};

export default serverStartLog;
