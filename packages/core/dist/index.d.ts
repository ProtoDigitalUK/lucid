interface StartOptions {
    port: number;
    origin?: string;
}
type Start = (options: StartOptions) => Promise<void>;
declare const exportObject: {
    start: Start;
};
export default exportObject;
//# sourceMappingURL=index.d.ts.map