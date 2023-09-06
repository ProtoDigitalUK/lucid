declare const _default: {
    clearSingle: (client: import("pg").PoolClient, data: import("./clear-single.js").ServiceData) => Promise<void>;
    clearAll: (client: import("pg").PoolClient) => Promise<void>;
    processImage: (client: import("pg").PoolClient, data: import("./process-image.js").ServiceData) => Promise<import("./process-image.js").Response>;
    getSingleCount: (client: import("pg").PoolClient, data: import("./get-single-count.js").ServiceData) => Promise<number>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map