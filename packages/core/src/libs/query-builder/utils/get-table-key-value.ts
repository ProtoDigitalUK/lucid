import type { ReferenceExpression } from "kysely";

const getTableKeyValue = <DB, Table extends keyof DB>(
	key: string,
	keyMap?: Record<string, ReferenceExpression<DB, Table>>,
): ReferenceExpression<DB, Table> => {
	if (keyMap?.[key]) {
		return keyMap[key] || (key as ReferenceExpression<DB, Table>);
	}
	return key as ReferenceExpression<DB, Table>;
};

export default getTableKeyValue;
