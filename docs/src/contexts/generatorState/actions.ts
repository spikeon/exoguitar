import { Dispatch } from "react";
import { ACTION, GeneratorStateAction, GeneratorStateActions } from "./types";
import { Part } from "../../types/Parts";
import { GuitarType } from "../../types/State";

const getActions = (dispatch: Dispatch<GeneratorStateAction>): GeneratorStateActions => ({
    setGuitarType: (guitarType: GuitarType) => {
        dispatch({
            type: ACTION.SET_GUITAR_TYPE,
            payload: {guitarType}
        })
    },
    unsetGuitarType: () => {
        dispatch({type: ACTION.UNSET_GUITAR_TYPE, payload: {}})
    },
    setNeck: (neck: Part) => {
        dispatch({
            type: ACTION.SET_NECK,
            payload: { neck }
        });
    },
    unsetNeck: () => {
        dispatch({
            type: ACTION.UNSET_NECK,
            payload: {}
        });
    },
    setHead: (head: Part) => {
        dispatch({
            type: ACTION.SET_HEAD,
            payload: { head }
        });
    },
    unsetHead: () => {
        dispatch({
            type: ACTION.UNSET_HEAD,
            payload: {}
        });
    },
    setWingSet: (wingSet: Part) => {
        dispatch({
            type: ACTION.SET_WING_SET,
            payload: { wingSet }
        });
    },
    unsetWingSet: () => {
        dispatch({
            type: ACTION.UNSET_WING_SET,
            payload: {}
        });
    },
    setFacePlate: (facePlate: Part) => {
        dispatch({
            type: ACTION.SET_FACE_PLATE,
            payload: { facePlate }
        });
    },
    unsetFacePlate: () => {
        dispatch({
            type: ACTION.UNSET_FACE_PLATE,
            payload: {}
        });
    },
    setBridge: (bridge: Part) => {
        dispatch({
            type: ACTION.SET_BRIDGE,
            payload: { bridge }
        });
    },
    unsetBridge: () => {
        dispatch({
            type: ACTION.UNSET_BRIDGE,
            payload: {}
        });
    },

})

export default getActions;