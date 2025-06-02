import {Part} from "../../types/Parts";

export type PartsState = {
    parts: Part[]
}

export enum ACTION {
    SET_PARTS, 
    ADD_PARTS_PART,
    REMOVE_PARTS_PART
}

type SetPartsAction = {
    type: ACTION.SET_PARTS,
    payload: {
        parts: Part[]
    }
}

type addPartsPart = {
    type: ACTION.ADD_PARTS_PART,
    payload: {
        part: Part
    }
}

type removePartsPart = {
    type: ACTION.REMOVE_PARTS_PART,
    payload: {
        part: Part
    }
}

export type PartsAction = SetPartsAction | addPartsPart | removePartsPart;

export type PartsActions = {
    setParts: (parts: Part[]) => void
    addPartsPart : (part:Part) => void
    removePartsPart : (part: Part) => void
}