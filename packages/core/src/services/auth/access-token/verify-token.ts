import T from "../../../translations/index.js";
import constants from "../../../constants/constants.js";
import jwt from "jsonwebtoken";
import type { FastifyRequest } from "fastify";
import type { ServiceResponse } from "../../../utils/services/types.js";

const verifyToken = (
	request: FastifyRequest,
): Awaited<ServiceResponse<FastifyRequest["auth"]>> => {
	try {
		const _access = request.cookies[constants.accessTokenKey];

		if (!_access) {
			return {
				error: {
					type: "authorisation",
					code: "authorisation",
					message: T("not_authorised_to_perform_action"),
				},
				data: undefined,
			};
		}

		const decode = jwt.verify(
			_access,
			request.server.config.keys.accessTokenSecret,
		) as FastifyRequest["auth"];

		return {
			error: undefined,
			data: decode,
		};
	} catch (err) {
		return {
			error: {
				type: "authorisation",
				code: "authorisation",
				message: T("not_authorised_to_perform_action"),
			},
			data: undefined,
		};
	}
};

export default verifyToken;
