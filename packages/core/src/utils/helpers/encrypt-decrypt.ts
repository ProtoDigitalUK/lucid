import crypto from "node:crypto";

export const encryptSecret = (secret: string, encryptionKey: string) => {
	const iv = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv(
		"aes-256-cbc",
		Buffer.from(encryptionKey, "hex"),
		iv,
	);
	let encrypted = cipher.update(secret, "utf8", "hex");
	encrypted += cipher.final("hex");
	return `${iv.toString("hex")}:${encrypted}`;
};

export const decryptSecret = (
	encryptedSecret: string,
	encryptionKey: string,
) => {
	const [iv, encrypted] = encryptedSecret.split(":");
	const decipher = crypto.createDecipheriv(
		"aes-256-cbc",
		Buffer.from(encryptionKey, "hex"),
		Buffer.from(iv as string, "hex"),
	);
	let decrypted = decipher.update(encrypted as string, "hex", "utf8");
	decrypted += decipher.final("utf8");
	return decrypted.toString();
};
