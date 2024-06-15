import { expect, test, beforeAll, afterAll } from "vitest";
import testConfig from "../test-helpers/test-config.js";
import testDatabase from "../test-helpers/test-database.js";
import serviceWrapper, {
	type ServiceConfig,
	type ServiceResponse,
} from "./service-wrapper.js";

const CONSTANTS = {
	error: {
		level1: {
			status: 500,
			code: "internal",
			name: "Example Error - Level 1",
			message: "An unknown error occurred",
		},
		level2: {
			status: 500,
			code: "internal",
			name: "Example Error - Level 2",
			message: "An unknown error occurred",
		},
	},
};

// -----------------------------------------------
// Setup and Teardown
beforeAll(async () => {
	await testDatabase.migrate();
});
afterAll(async () => {
	await testDatabase.destroy();
});

// -----------------------------------------------
// Tests

test("basic - one level deep service wrapper success and error", async () => {
	const config = await testConfig.basic();

	// Setup
	const testService = async (
		serviceConfig: ServiceConfig,
		props: {
			data: Record<string, string>;
			returnError: boolean;
		},
	): ServiceResponse<Record<string, string>> => {
		await new Promise((resolve) => setTimeout(resolve, 50));

		if (props.returnError) {
			return {
				error: CONSTANTS.error.level1,
				data: undefined,
			};
		}
		return {
			error: undefined,
			data: props.data,
		};
	};

	// Execute
	const [success, error] = await Promise.all([
		serviceWrapper(testService, {
			transaction: false,
		})(
			{
				db: config.db.client,
				config: config,
			},
			{
				data: {
					test: "test",
				},
				returnError: false,
			},
		),
		serviceWrapper(testService, {
			transaction: false,
		})(
			{
				db: config.db.client,
				config: config,
			},
			{
				data: {
					test: "test",
				},
				returnError: true,
			},
		),
	]);

	expect(success.data).toBeDefined();
	expect(error.error).toEqual(CONSTANTS.error.level1);
});

test("basic - two level deep service wrapper success and error", async () => {
	//* requires service to handle returning errors

	const config = await testConfig.basic();

	// Setup
	const testServiceOne = async (
		serviceConfig: ServiceConfig,
		props: {
			data: Record<string, string>;
			returnError: boolean;
		},
	): ServiceResponse<Record<string, string>> => {
		await new Promise((resolve) => setTimeout(resolve, 50));

		const serviceTwo = await serviceWrapper(testServiceTwo, {
			transaction: false,
		})(serviceConfig, props);
		if (serviceTwo.error) return serviceTwo;

		if (props.returnError) {
			return {
				error: CONSTANTS.error.level1,
				data: undefined,
			};
		}
		return {
			error: undefined,
			data: props.data,
		};
	};
	const testServiceTwo = async (
		serviceConfig: ServiceConfig,
		props: {
			data: Record<string, string>;
			returnError: boolean;
		},
	): ServiceResponse<Record<string, string>> => {
		await new Promise((resolve) => setTimeout(resolve, 50));

		if (props.returnError) {
			return {
				error: CONSTANTS.error.level2,
				data: undefined,
			};
		}
		return {
			error: undefined,
			data: props.data,
		};
	};

	// Execute
	const [success, error] = await Promise.all([
		serviceWrapper(testServiceOne, {
			transaction: false,
		})(
			{
				db: config.db.client,
				config: config,
			},
			{
				data: {
					test: "test",
				},
				returnError: false,
			},
		),
		serviceWrapper(testServiceOne, {
			transaction: false,
		})(
			{
				db: config.db.client,
				config: config,
			},
			{
				data: {
					test: "test",
				},
				returnError: true,
			},
		),
	]);

	expect(success.data).toBeDefined();
	expect(error.error).toEqual(CONSTANTS.error.level2);
});

test("transaction - one level deep service wrapper success and error", async () => {
	const config = await testConfig.basic();
	const successCollectionKey = "transaction_test_success_1";
	const errorCollectionKey = "transaction_test_error_1";

	// Setup
	const createDocument = async (
		serviceConfig: ServiceConfig,
		props: {
			collectionKey: string;
			returnError: boolean;
		},
	): ServiceResponse<{ id: number }> => {
		const documentRes = await serviceConfig.db
			.insertInto("lucid_collection_documents")
			.values({
				collection_key: props.collectionKey,
			})
			.returning("id")
			.executeTakeFirst();

		if (props.returnError) {
			return {
				error: CONSTANTS.error.level1,
				data: undefined,
			};
		}

		if (documentRes === undefined)
			return {
				error: CONSTANTS.error.level1,
				data: undefined,
			};

		return {
			error: undefined,
			data: documentRes,
		};
	};

	// Execute
	const [success, error] = await Promise.all([
		serviceWrapper(createDocument, {
			transaction: true,
		})(
			{
				db: config.db.client,
				config: config,
			},
			{
				collectionKey: successCollectionKey,
				returnError: false,
			},
		),
		serviceWrapper(createDocument, {
			transaction: true,
		})(
			{
				db: config.db.client,
				config: config,
			},
			{
				collectionKey: errorCollectionKey,
				returnError: true, // toggle to verify transaction rollback is working
			},
		),
	]);

	expect(success.data).toBeDefined();
	expect(error.error).toEqual(CONSTANTS.error.level1);
	expect(
		await config.db.client
			.selectFrom("lucid_collection_documents")
			.select("id")
			.where("collection_key", "=", errorCollectionKey)
			.executeTakeFirst(),
	).toBeUndefined();
});

test("transaction - two level deep service wrapper success and error", async () => {
	const config = await testConfig.basic();
	const successCollectionKey = "transaction_test_success_2";
	const errorCollectionKey = "transaction_test_error_2";

	// Setup
	const createDocumentWithDepth = async (
		serviceConfig: ServiceConfig,
		props: {
			collectionKey: string;
			returnError: boolean;
			levelTwo: {
				call: boolean;
				returnError: boolean;
			};
		},
	): ServiceResponse<{ id: number }> => {
		const documentRes = await serviceConfig.db
			.insertInto("lucid_collection_documents")
			.values({
				collection_key: props.collectionKey,
			})
			.returning("id")
			.executeTakeFirst();

		if (props.returnError) {
			return {
				error: props.levelTwo.call
					? CONSTANTS.error.level1
					: CONSTANTS.error.level2,
				data: undefined,
			};
		}

		if (documentRes === undefined)
			return {
				error: props.levelTwo.call
					? CONSTANTS.error.level1
					: CONSTANTS.error.level2,
				data: undefined,
			};

		if (props.levelTwo.call) {
			return await serviceWrapper(createDocumentWithDepth, {
				transaction: true,
			})(serviceConfig, {
				collectionKey: successCollectionKey,
				returnError: props.levelTwo.returnError,
				levelTwo: {
					...props.levelTwo,
					call: false,
				},
			});
		}

		return {
			error: undefined,
			data: documentRes,
		};
	};

	// Execute
	const [success, error] = await Promise.all([
		serviceWrapper(createDocumentWithDepth, {
			transaction: true,
		})(
			{
				db: config.db.client,
				config: config,
			},
			{
				collectionKey: successCollectionKey,
				returnError: false,
				levelTwo: {
					call: true,
					returnError: false,
				},
			},
		),
		serviceWrapper(createDocumentWithDepth, {
			transaction: true,
		})(
			{
				db: config.db.client,
				config: config,
			},
			{
				collectionKey: errorCollectionKey,
				returnError: false,
				levelTwo: {
					call: true,
					returnError: true, // toggle to verify transaction rollback is working from level two
				},
			},
		),
	]);

	expect(success.data).toBeDefined();
	expect(error.error).toEqual(CONSTANTS.error.level2);

	const [successDocuments, errorDocuments] = await Promise.all([
		config.db.client
			.selectFrom("lucid_collection_documents")
			.select("id")
			.where("collection_key", "=", successCollectionKey)
			.execute(),
		config.db.client
			.selectFrom("lucid_collection_documents")
			.select("id")
			.where("collection_key", "=", errorCollectionKey)
			.executeTakeFirst(),
	]);

	expect(successDocuments.length).toBe(2);
	expect(errorDocuments).toBeUndefined();
});
