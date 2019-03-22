export interface StateName {
    code: string;
    id: number;
    name: string;
}
export interface StateInfos {
    codeToStateName: Map<string, StateName>;
    idToStateName: Map<number, StateName>;
}
export interface DataCollection {
    stateInfos: StateInfos;
}
export declare const loadAllData: () => Promise<DataCollection>;
//# sourceMappingURL=DataHandling.d.ts.map