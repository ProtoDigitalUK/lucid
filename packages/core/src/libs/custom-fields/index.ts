import type { CustomFieldData, FieldTypes } from "./types.js";

export interface CustomFieldInstance {
	data<T extends FieldTypes>(): CustomFieldData<T>;
}

export default abstract class CustomFieldCreator<T extends FieldTypes> {
	public abstract factoryMethod(): CustomFieldInstance;

	public data(): CustomFieldData<T> {
		const customField = this.factoryMethod();

		return customField.data();
	}
	public validate() {}
}
