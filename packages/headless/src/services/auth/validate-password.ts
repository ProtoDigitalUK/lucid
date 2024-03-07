import argon2 from "argon2";

export interface ServiceData {
	hashed_password: string;
	password: string;
}

const validatePassword = async (data: ServiceData) => {
	return await argon2.verify(data.hashed_password, data.password);
};

export default validatePassword;
