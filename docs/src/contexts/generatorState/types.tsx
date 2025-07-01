import {Part, Section} from "../../types/Parts";
import { GeneratorState, GuitarType } from "../../types/State";

export enum ACTION {
    SET_GUITAR_TYPE,
    UNSET_GUITAR_TYPE,
    SET_NECK,
    UNSET_NECK,
    SET_HEAD,
    UNSET_HEAD,
    SET_WING_SET,
    UNSET_WING_SET,
    SET_FACE_PLATE,
    UNSET_FACE_PLATE,
    SET_BRIDGE,
    UNSET_BRIDGE,
    // ADD_EXTRA,
    // REMOVE_EXTRA, 
}

type SetGuitarTypeAction = {
    type: ACTION.SET_GUITAR_TYPE,
    payload: {
        guitarType: GuitarType
    }
}

type UnsetGuitarTypeAction = {
    type: ACTION.UNSET_GUITAR_TYPE,
    payload: {}
}

type SetNeckAction = {
    type: ACTION.SET_NECK,
    payload: {
        neck: Part
    }
}

type UnsetNeckAction = {
    type: ACTION.UNSET_NECK,
    payload: {}
}

type SetHeadAction = {
    type: ACTION.SET_HEAD,
    payload: {
        head: Part
    }
}

type UnsetHeadAction = {
    type: ACTION.UNSET_HEAD,
    payload: {}
}

type SetWingSetAction = {
    type: ACTION.SET_WING_SET,
    payload: {
        wingSet: Part
    }
}

type UnsetWingSetAction = {
    type: ACTION.UNSET_WING_SET,
    payload: {}
}

type SetFacePlateAction = {
    type: ACTION.SET_FACE_PLATE,
    payload: {
        facePlate: Part
    }
}

type UnsetFacePlateAction = {
    type: ACTION.UNSET_FACE_PLATE,
    payload: {}
}

type SetBridgeAction = {
    type: ACTION.SET_BRIDGE,
    payload: {
        bridge: Part
    }
}

type UnsetBridgeAction = {
    type: ACTION.UNSET_BRIDGE,
    payload: {}
}


export type GeneratorStateAction = 
    SetGuitarTypeAction |
    UnsetGuitarTypeAction |
    SetHeadAction | 
    UnsetHeadAction | 
    SetNeckAction | 
    UnsetNeckAction |
    SetWingSetAction |
    UnsetWingSetAction |
    SetFacePlateAction | 
    UnsetFacePlateAction | 
    SetBridgeAction |
    UnsetBridgeAction;

export type GeneratorStateActions = {

    setGuitarType: (guitarType: GuitarType) => void,
    unsetGuitarType: () => void,

    setNeck: (neck: Part) => void,
    unsetNeck: () => void,

    setHead: (head: Part) => void,
    unsetHead: () => void,

    setWingSet: (wingSet: Part) => void,
    unsetWingSet: () => void,

    setFacePlate: (facePlate: Part) => void,
    unsetFacePlate: () => void,

    setBridge: (bridge: Part) => void,
    unsetBridge: () => void,
}