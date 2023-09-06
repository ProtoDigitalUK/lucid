const formatForm = (instance) => {
    return {
        key: instance.key,
        title: instance.options.title,
        description: instance.options.description || null,
        fields: instance.options.fields,
    };
};
export default formatForm;
//# sourceMappingURL=format-form.js.map