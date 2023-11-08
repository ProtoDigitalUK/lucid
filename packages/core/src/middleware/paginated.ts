import { FastifyRequest } from "fastify";
import constants from "@root/constants.js";
import { QueryType } from "@middleware/validate.js";

const paginated = async (
  request: FastifyRequest<{
    Querystring: QueryType;
  }>
) => {
  if (!request.query.page) {
    request.query.page = constants.pagination.page;
  }

  if (!request.query.per_page) {
    request.query.per_page = constants.pagination.perPage;
  }
};

export default paginated;
