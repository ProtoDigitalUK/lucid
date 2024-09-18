import projectPackage from "../../../package.json" assert { type: "json" };
import constants from "../../constants/constants.js";

const bgLimeGreen = "\x1b[102m";
const textLimeGreen = "\x1b[92m";
const textGreen = "\x1b[32m";
const textBlue = "\x1b[34m";
const textGray = "\x1b[90m";
const reset = "\x1b[0m";
const bold = "\x1b[1m";

const serverStartLog = async (address: string, start: [number, number]) => {
	const loadTime = Math.round(process.hrtime(start)[1] / 1000000);
	console.log("");
	console.log(
		`${bgLimeGreen}${textGreen}${bold} LUCID CMS ${reset} ${textLimeGreen}v${projectPackage.version}${reset} ready in ${textGreen}${loadTime} ms\n${reset}`,
	);
	console.log(`┃ 🔐 Admin            ${textBlue}${address}/admin${reset}`);
	console.log(
		`┃ 📖 Documentation    ${textBlue}${constants.documentation}${reset}`,
	);
	console.log(
		`┃ 🖥️  Lucid UI         ${textBlue}${constants.lucidUi}${reset}`,
	);
	console.log("");
	console.log(`${textGray}Press CTRL-C to stop the server${reset}`);
	console.log("");
};

export default serverStartLog;
