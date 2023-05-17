import type { Controller } from "../../../types/index.js";
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
      api: 100,
      db: 200,
    },
  });
};

export default getHealth;
