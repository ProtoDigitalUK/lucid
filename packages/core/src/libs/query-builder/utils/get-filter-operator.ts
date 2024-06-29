import type {
	QueryFilterValue,
	QueryFilterOperator,
} from "../../../middleware/validate-query.js";
import type { ComparisonOperatorExpression } from "kysely";

const getFilterOperator = (
	key: string,
	f: {
		value: QueryFilterValue;
		operator?: QueryFilterOperator;
	},
	operators?: Record<string, ComparisonOperatorExpression | "%">,
) => {
	if (f.operator !== undefined) return f.operator;
	if (Array.isArray(f.value)) return "in";
	return operators?.[key] || "=";
};

export default getFilterOperator;
