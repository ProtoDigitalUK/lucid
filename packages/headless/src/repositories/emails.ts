import type { HeadlessEmails, Select } from "../libs/db/types.js";
import {
	deleteQB,
	selectQB,
	type QueryBuilderWhereT,
} from "../libs/db/query-builder.js";

export default class Emails {
	constructor(private db: DB) {}
}
