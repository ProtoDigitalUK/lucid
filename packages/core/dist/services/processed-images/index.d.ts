declare const _default: {
    clearSingle: (client: import("pg").PoolClient, data: import("./clear-single").ServiceData) => Promise<void>;
    clearAll: (client: import("pg").PoolClient) => Promise<void>;
    processImage: (client: import("pg").PoolClient, data: import("./process-image").ServiceData) => Promise<import("./process-image").Response>;
    getSingleCount: (client: import("pg").PoolClient, data: import("./get-single-count").ServiceData) => Promise<number>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map