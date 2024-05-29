import CustomFieldCreator, { type CustomFieldInstance } from "./index.js";
import type { CustomFieldData } from "./types.js";

class TextCustomField implements CustomFieldInstance {
	public data(): CustomFieldData<"text"> {
		return {
			key: "temp",
		};
	}
}

export default class TextCustomFieldCreator extends CustomFieldCreator<"text"> {
	public factoryMethod(): CustomFieldInstance {
		return new TextCustomField();
	}
}
