import * as d3 from 'd3';

export interface StateName {
    code: string,
    id: number,
    name: string
};

export interface StateInfos {
    codeToStateName: Map<string, StateName>,
    idToStateName: Map<number, StateName>
};

const cleanStateName = (d: any): StateName => ({
    code: d.code,
    id: Number(d.id),
    name: d.name
});


export interface DataCollection {
    stateInfos: StateInfos
};

export const loadAllData = async (): Promise<DataCollection> => {
    let stateNamesPromise = d3.tsv('data/us-state-names.tsv', cleanStateName);
    let stateNames = await stateNamesPromise;
    // Weird way to check for errors
    if (stateNames.columns.length != 3) {
        throw "Failed to load state names data!";
    }
    return {
        stateInfos: makeStateInfos(stateNames)
    };
};

function makeStateInfos(names: StateName[]): StateInfos {
    let stateInfos: StateInfos = { codeToStateName: new Map<string, StateName>(), idToStateName: new Map<number, StateName>() };
    for (let name of names) {
        stateInfos.codeToStateName.set(name.code, name);
        stateInfos.idToStateName.set(name.id, name);
    }
    return stateInfos;
}
