import type { Controller } from "../../../types/index.js";
import z from "zod";

export const body = z.undefined();
export const query = z.undefined();
export const params = z.object({
  id: z.string().max(10),
});

const me: Controller<typeof params, typeof body, typeof query> = (req, res) => {
  res.status(200).json({
    id: req.params.id,
    name: "John Doe",
    email: "johndoe@example.com",
    role: "admin",
  });
};

export default me;
