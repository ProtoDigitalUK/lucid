import FormBuilder from "@lucid/form-builder";
// Services
import formSubService from "@services/form-submissions";

export interface ServiceData {
  environment_key: string;
  form: FormBuilder;
  data: {
    [key: string]: string | number | boolean;
  };
}

const submitForm = async (props: ServiceData) => {
  const data: {
    name: string;
    value: string | number | boolean;
    type: "string" | "number" | "boolean";
  }[] = [];

  // Create or update form fields
  for (let [key, value] of Object.entries(props.data)) {
    // Set default value if it is not set
    if (!value) {
      const defaultValue = props.form.options.fields.find(
        (field) => field.name === key
      )?.default_value;
      if (defaultValue !== undefined) {
        value = defaultValue;
      }
    }

    // Check if the value is a string, number or boolean
    const type = typeof value;
    if (type !== "string" && type !== "number" && type !== "boolean") {
      throw new Error(
        "Form submision data must be a string, number or boolean."
      );
    }

    // Add to data array
    data.push({
      name: key,
      value: value,
      type: type,
    });
  }

  const formRes = await formSubService.createSingle({
    id: undefined,
    form_key: props.form.key,
    environment_key: props.environment_key,
    data,
  });

  return formRes;
};

export default submitForm;
