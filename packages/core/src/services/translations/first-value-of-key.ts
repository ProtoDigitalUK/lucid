export interface ServiceData {
  translations: {
    value: string;
    language_id: number;
    key: "name" | "alt";
    id?: number | undefined;
  }[];
  key: string;
}

const firstValueOfKey = (data: ServiceData) => {
  const { translations, key } = data;
  const translation = translations.find((translation) => {
    return translation.key === key;
  });
  return translation ? translation.value : undefined;
};

export default firstValueOfKey;
