import {Part, Section} from "../../types/Parts";
import { GeneratorState, GuitarType, NeckType } from "../../types/State";

export enum ACTION {
    SET_GUITAR_TYPE,
    SET_NECK_TYPE,
    SET_NECK,
    SET_HEAD,
    SET_WING_SET,
    SET_FACE_PLATE,
    SET_BRIDGE,
    ADD_EXTRA,
    RESET
}

type SetGuitarTypeAction = {
    type: ACTION.SET_GUITAR_TYPE,
    payload: {
        guitarType: GuitarType
    }
}

type SetNeckTypeAction = {
    type: ACTION.SET_NECK_TYPE,
    payload: {
        neckType: NeckType
    }
}

type SetNeckAction = {
    type: ACTION.SET_NECK,
    payload: {
        neck: Part
    }
}

type ResetAction = {
    type: ACTION.RESET,
    payload: {}
}

type SetHeadAction = {
    type: ACTION.SET_HEAD,
    payload: {
        head: Part
    }
}

type SetWingSetAction = {
    type: ACTION.SET_WING_SET,
    payload: {
        wingSet: Part
    }
}

type AddExtraAction = {
    type: ACTION.ADD_EXTRA;
    payload: {
        part: Part
    }
}

type SetFacePlateAction = {
    type: ACTION.SET_FACE_PLATE,
    payload: {
        facePlate: Part
    }
}

type SetBridgeAction = {
    type: ACTION.SET_BRIDGE,
    payload: {
        bridge: Part
    }
}


export type GeneratorStateAction = 
    SetGuitarTypeAction |
    SetNeckTypeAction | 
    SetHeadAction | 
    SetNeckAction | 
    SetWingSetAction |
    SetFacePlateAction | 
    SetBridgeAction |
    AddExtraAction | 
    ResetAction

export type GeneratorStateActions = {
    setGuitarType: (guitarType: GuitarType) => void,
    setNeckType: (neckType: NeckType) => void,
    setNeck: (neck: Part) => void,
    setHead: (head: Part) => void,
    setWingSet: (wingSet: Part) => void,
    setFacePlate: (facePlate: Part) => void,
    setBridge: (bridge: Part) => void,
    addExtra: (part: Part) => void,
    reset: () => void
}