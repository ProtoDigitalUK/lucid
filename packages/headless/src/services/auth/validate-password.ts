import argon2 from "argon2";

export interface ServiceData {
	hashedPassword: string;
	password: string;
}

const validatePassword = async (data: ServiceData) => {
	return await argon2.verify(data.hashedPassword, data.password);
};

export default validatePassword;
