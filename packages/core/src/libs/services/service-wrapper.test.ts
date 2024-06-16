import { expect, test, beforeAll, afterAll } from "vitest";
import z from "zod";
import testConfig from "../test-helpers/test-config.js";
import testDatabase from "../test-helpers/test-database.js";
import serviceWrapper from "./service-wrapper.js";
import type { ServiceResponse, ServiceFn } from "./types.js";
import mergeServiceError from "./utils/merge-errors.js";

const CONSTANTS = {
	error: {
		level1: mergeServiceError({
			type: "basic",
			status: 500,
			name: "Example Error - Level 1",
		}),
		level2: mergeServiceError({
			type: "basic",
			status: 500,
			name: "Example Error - Level 2",
		}),
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
	const testService: ServiceFn<
		[
			{
				data: Record<string, string>;
				returnError: boolean;
			},
		],
		Record<string, string>
	> = async (_, data) => {
		await new Promise((resolve) => setTimeout(resolve, 50));

		if (data.returnError) {
			return {
				error: CONSTANTS.error.level1,
				data: undefined,
			};
		}
		return {
			error: undefined,
			data: data.data,
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
	const testServiceOne: ServiceFn<
		[
			{
				data: Record<string, string>;
				returnError: boolean;
			},
		],
		Record<string, string>
	> = async (service, data) => {
		await new Promise((resolve) => setTimeout(resolve, 50));

		const serviceTwo = await testServiceTwo(service, data);
		if (serviceTwo.error) return serviceTwo;

		if (data.returnError) {
			return {
				error: CONSTANTS.error.level1,
				data: undefined,
			};
		}
		return {
			error: undefined,
			data: data.data,
		};
	};
	const testServiceTwo: ServiceFn<
		[
			{
				data: Record<string, string>;
				returnError: boolean;
			},
		],
		Record<string, string>
	> = async (_, data): ServiceResponse<Record<string, string>> => {
		await new Promise((resolve) => setTimeout(resolve, 50));

		if (data.returnError) {
			return {
				error: CONSTANTS.error.level2,
				data: undefined,
			};
		}
		return {
			error: undefined,
			data: data.data,
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
	const createDocument: ServiceFn<
		[
			{
				collectionKey: string;
				returnError: boolean;
			},
		],
		{ id: number }
	> = async (service, data) => {
		const documentRes = await service.db
			.insertInto("lucid_collection_documents")
			.values({
				collection_key: data.collectionKey,
			})
			.returning("id")
			.executeTakeFirst();

		if (data.returnError) {
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
	const createDocumentWithDepth: ServiceFn<
		[
			{
				collectionKey: string;
				returnError: boolean;
				levelTwo: {
					call: boolean;
					returnError: boolean;
				};
			},
		],
		{ id: number }
	> = async (service, data) => {
		const documentRes = await service.db
			.insertInto("lucid_collection_documents")
			.values({
				collection_key: data.collectionKey,
			})
			.returning("id")
			.executeTakeFirst();

		if (data.returnError) {
			return {
				error: data.levelTwo.call
					? CONSTANTS.error.level1
					: CONSTANTS.error.level2,
				data: undefined,
			};
		}

		if (documentRes === undefined)
			return {
				error: data.levelTwo.call
					? CONSTANTS.error.level1
					: CONSTANTS.error.level2,
				data: undefined,
			};

		if (data.levelTwo.call) {
			return await createDocumentWithDepth(service, {
				collectionKey: successCollectionKey,
				returnError: data.levelTwo.returnError,
				levelTwo: {
					...data.levelTwo,
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

test("service wrapper schema validation", async () => {
	const config = await testConfig.basic();

	const schema = z.object({
		key: z.string(),
		value: z.string(),
	});

	// Setup
	const testService: ServiceFn<
		[Record<string, string>],
		Record<string, string>
	> = async (service, data) => {
		return {
			error: undefined,
			data: data,
		};
	};

	// Execute
	const [success, error] = await Promise.all([
		serviceWrapper(testService, {
			transaction: false,
			schema: schema,
		})(
			{
				db: config.db.client,
				config: config,
			},
			{
				key: "test",
				value: "test",
			},
		),
		serviceWrapper(testService, {
			transaction: false,
			schema: schema,
		})(
			{
				db: config.db.client,
				config: config,
			},
			{
				key: "test",
				// @ts-expect-error
				value: 100,
			},
		),
	]);

	expect(success.data).toEqual({
		key: "test",
		value: "test",
	});
	expect(error.error?.zod).toBeDefined();
});
