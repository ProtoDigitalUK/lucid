interface ServiceData {}

const getHealth = async (data: ServiceData) => {
  return {
    api: "ok",
    db: "ok",
  };
};

export default getHealth;
