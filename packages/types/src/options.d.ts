import type { BooleanInt } from "../../headless/src/libs/db/types.js";
export type OptionNameT = "media_storage_used";

export interface OptionsResT {
	name: OptionNameT;
	value_text: string | null;
	value_int: number | null;
	value_bool: BooleanInt | null;
}
