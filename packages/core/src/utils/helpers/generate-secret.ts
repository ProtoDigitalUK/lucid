import crypto from "node:crypto";
import { encrypt } from "../helpers/encrypt-decrypt.js";

const generateSecret = (
	encryptionKey: string,
): {
	secret: string;
	encryptSecret: string;
} => {
	const secret = crypto.randomBytes(32).toString("hex");

	return {
		secret: secret,
		encryptSecret: encrypt(secret, encryptionKey),
	};
};

export default generateSecret;
