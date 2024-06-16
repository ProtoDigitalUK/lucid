import T from "../../translations/index.js";
import Repository from "../../libs/repositories/index.js";
import type { ServiceFn } from "../../libs/services/types.js";

const getSingle: ServiceFn<
	[
		{
			tokenType: "password_reset";
			token: string;
		},
	],
	{
		id: number;
		user_id: number | null;
	}
> = async (service, data) => {
	const UserTokensRepo = Repository.get("user-tokens", service.db);

	const userToken = await UserTokensRepo.selectSingle({
		select: ["id", "user_id"],
		where: [
			{
				key: "token",
				operator: "=",
				value: data.token,
			},
			{
				key: "token_type",
				operator: "=",
				value: data.tokenType,
			},
			{
				key: "expiry_date",
				operator: ">",
				value: new Date().toISOString(),
			},
		],
	});

	if (userToken === undefined) {
		return {
			error: {
				type: "basic",
				name: T("error_not_found_name", {
					name: T("token"),
				}),
				message: T("error_not_found_message", {
					name: T("token"),
				}),
				status: 404,
			},
			data: undefined,
		};
	}

	return {
		error: undefined,
		data: userToken,
	};
};

export default getSingle;
