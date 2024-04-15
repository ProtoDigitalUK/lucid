import T from "../translations/index.js";
import type { FastifyRequest } from "fastify";
import { HeadlessAPIError } from "../utils/error-handler.js";
import auth from "../services/auth/index.js";

const authenticate = async (request: FastifyRequest) => {
	const accessToken = await auth.accessToken.verifyAccessToken(request);

	if (!accessToken.success || !accessToken.data) {
		throw new HeadlessAPIError({
			type: "authorisation",
			message: T("not_authorised_to_perform_action"),
		});
	}

	request.auth = accessToken.data;
};

export default authenticate;
