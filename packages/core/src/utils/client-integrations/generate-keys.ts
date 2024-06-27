import crypto from "node:crypto";
import argon2 from "argon2";
import { generateSecret } from "../helpers/index.js";

const generateKeys = async (
	encryptionKey: string,
): Promise<{
	key: string;
	apiKey: string;
	apiKeyHash: string;
	secret: string;
}> => {
	const apiKey = crypto.randomBytes(32).toString("hex");
	const { secret, encryptSecret } = generateSecret(encryptionKey);
	const apiKeyHash = await argon2.hash(apiKey, {
		secret: Buffer.from(secret),
	});

	return {
		key: crypto.randomBytes(3).toString("hex"),
		apiKey: apiKey,
		apiKeyHash: apiKeyHash,
		secret: encryptSecret,
	};
};

export default generateKeys;
