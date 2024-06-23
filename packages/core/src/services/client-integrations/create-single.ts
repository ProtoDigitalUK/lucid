import T from "../../translations/index.js";
import Repository from "../../libs/repositories/index.js";
import generateKeys from "../../utils/client-integrations/generate-keys.js";
import type { ServiceFn } from "../../utils/services/types.js";

const createSingle: ServiceFn<
	[
		{
			name: string;
			description?: string;
		},
	],
	{
		id: number;
		apiKey: string;
	}
> = async (context, data) => {
	const ClientIntegrationsRepo = Repository.get(
		"client-integrations",
		context.db,
	);

	const { key, apiKey, apiKeyHash, secret } = await generateKeys(
		context.config.keys.encryptionKey,
	);

	const keyExistsRes = await ClientIntegrationsRepo.selectSingle({
		select: ["id"],
		where: [
			{
				key: "key",
				operator: "=",
				value: key,
			},
		],
	});
	if (keyExistsRes !== undefined) {
		return {
			error: {
				type: "basic",
				message: T("client_integration_key_already_exists"),
				status: 400,
			},
			data: undefined,
		};
	}

	const newIntegrationRes = await ClientIntegrationsRepo.createSingle({
		name: data.name,
		description: data.description,
		enabled: 1,
		key: key,
		secret: secret,
		apiKey: apiKeyHash,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	});
	if (newIntegrationRes === undefined) {
		return {
			error: {
				type: "basic",
				status: 500,
			},
			data: undefined,
		};
	}

	return {
		error: undefined,
		data: {
			id: 1,
			apiKey: apiKey,
		},
	};
};

export default createSingle;
