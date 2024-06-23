import T from "../translations/index.js";
import constants from "../constants/constants.js";
import { LucidAPIError } from "../utils/errors/index.js";
import Repository from "../libs/repositories/index.js";
import { decryptSecret } from "../utils/helpers/encrypt-decrypt.js";
import argon2 from "argon2";
import type { FastifyRequest } from "fastify";

const clientAuthentication = async (request: FastifyRequest) => {
	try {
		const clientKey =
			request.headers[constants.headers.clientIntegrationKey];
		const apiKey = request.headers.authorization;

		if (!clientKey) {
			throw new LucidAPIError({
				type: "authorisation",
				message: T("client_integration_key_missing"),
				status: 401,
			});
		}
		if (!apiKey) {
			throw new LucidAPIError({
				type: "authorisation",
				message: T("client_integration_api_key_missing"),
				status: 401,
			});
		}

		const ClientIntegrationSRepo = Repository.get(
			"client-integrations",
			request.server.config.db.client,
		);

		const clientIntegration = await ClientIntegrationSRepo.selectSingle({
			where: [
				{
					key: "key",
					operator: "=",
					value: clientKey,
				},
			],
			select: ["id", "api_key", "secret", "enabled"],
		});
		if (clientIntegration === undefined) {
			throw new LucidAPIError({
				type: "authorisation",
				message: T("cannot_find_client_integration"),
				status: 401,
			});
		}
		if (clientIntegration.enabled === 0) {
			throw new LucidAPIError({
				type: "authorisation",
				message: T("client_integration_is_disabled"),
				status: 401,
			});
		}

		const secret = decryptSecret(
			clientIntegration.secret,
			request.server.config.keys.encryptionKey,
		);

		const verifyApiKey = await argon2.verify(
			clientIntegration.api_key,
			apiKey,
			{
				secret: Buffer.from(secret),
			},
		);
		if (verifyApiKey === false) {
			throw new LucidAPIError({
				type: "authorisation",
				message: T("invalid_client_integration_api_key"),
				status: 401,
			});
		}

		request.clientIntegrationAuth = {
			id: clientIntegration.id,
			key: clientKey as string,
		};
	} catch (error) {
		throw new LucidAPIError({
			type: "authorisation",
			message: T("client_integration_error"),
			status: 401,
		});
	}
};

export default clientAuthentication;
