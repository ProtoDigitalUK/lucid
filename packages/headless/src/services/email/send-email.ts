export type SendEmailT = (
	data: {
		[key: string]: unknown;
	},
	template: (
		template: string,
		data: {
			[key: string]: unknown;
		},
	) => string,
) => Promise<{
	success: boolean;
	message: string;
}>;

export interface ServiceData {
	placeholder: string;
}

const sendEmail = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {};

export default sendEmail;
