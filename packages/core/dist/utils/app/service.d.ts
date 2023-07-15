import { PoolClient } from "pg";
declare const service: <T extends any[], R>(fn: (client: PoolClient, ...args: T) => Promise<R>, transaction: boolean, outerClient?: PoolClient) => (...args: T) => Promise<R>;
export default service;
//# sourceMappingURL=service.d.ts.map