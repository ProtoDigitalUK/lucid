export interface ServiceData {
    key: string;
    environment_key: string;
}
declare const checkKeyUnique: (data: ServiceData) => Promise<void>;
export default checkKeyUnique;
//# sourceMappingURL=check-key-unique.d.ts.map