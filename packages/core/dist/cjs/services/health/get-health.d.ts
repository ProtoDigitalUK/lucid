export interface ServiceData {
}
declare const getHealth: (data: ServiceData) => Promise<{
    api: string;
    db: string;
}>;
export default getHealth;
//# sourceMappingURL=get-health.d.ts.map