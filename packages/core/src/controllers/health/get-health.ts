import z from "zod";

export const body = z.undefined();
export const query = z.undefined();
export const params = z.undefined();

const getHealth: Controller<typeof params, typeof body, typeof query> = (
  req,
  res
) => {
  res.status(200).json({
    health: {
      api: "ok",
      db: "ok",
    },
  });
};

export default getHealth;
