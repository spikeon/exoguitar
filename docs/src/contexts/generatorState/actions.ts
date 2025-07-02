import { Dispatch } from "react";
import { ACTION, GeneratorStateAction, GeneratorStateActions } from "./types";
import { Part } from "../../types/Parts";
import { GuitarType, NeckType } from "../../types/State";

const getActions = (dispatch: Dispatch<GeneratorStateAction>): GeneratorStateActions => ({
    setGuitarType: (guitarType: GuitarType) => {
        dispatch({
            type: ACTION.SET_GUITAR_TYPE,
            payload: {guitarType}
        })
    },
    setNeckType: (neckType: NeckType) => {
        dispatch({
            type: ACTION.SET_NECK_TYPE,
            payload: {neckType}
        })
    },
    setNeck: (neck: Part) => {
        dispatch({
            type: ACTION.SET_NECK,
            payload: { neck }
        });
    },
    setHead: (head: Part) => {
        dispatch({
            type: ACTION.SET_HEAD,
            payload: { head }
        });
    },
    setWingSet: (wingSet: Part) => {
        dispatch({
            type: ACTION.SET_WING_SET,
            payload: { wingSet }
        });
    },
    setFacePlate: (facePlate: Part) => {
        dispatch({
            type: ACTION.SET_FACE_PLATE,
            payload: { facePlate }
        });
    },
    setBridge: (bridge: Part) => {
        dispatch({
            type: ACTION.SET_BRIDGE,
            payload: { bridge }
        });
    },
    addExtra: (part: Part) => {
        dispatch({
            type: ACTION.ADD_EXTRA,
            payload: {part}
        })
    },
    reset: () => {
        dispatch({
            type: ACTION.RESET,
            payload: {}
        })
    }

})

export default getActions;