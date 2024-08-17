import type constants from "../../../constants/constants.js";
import type { LocaleValue } from "../../../types/shared.js";

export interface BrickConfigProps {
	title?: LocaleValue;
	description?: LocaleValue;
	preview?: {
		image?: string;
	};
}
export interface BrickConfig {
	title: LocaleValue;
	description?: LocaleValue;
	preview?: {
		image?: string;
	};
}

export type BrickTypes =
	(typeof constants.brickTypes)[keyof typeof constants.brickTypes];
