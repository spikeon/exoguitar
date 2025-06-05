import {Part, Section} from "../../types/Parts";

export type PartsState = {
    parts: Part[],
    sections: Section[],
}

export enum ACTION {
    SET_PARTS, 
}

type SetPartsAction = {
    type: ACTION.SET_PARTS,
    payload: {
        parts: Part[]
    }
}

export type PartsAction = SetPartsAction //| addPartsPart | removePartsPart;

export type PartsActions = {
    setParts: (parts: Part[]) => void
}