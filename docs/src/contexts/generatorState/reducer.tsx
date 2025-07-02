import { ACTION, GeneratorStateAction } from "./types";
import { GeneratorState } from "../../types/State";
import initialState from "./initialState";

const reducer = (state: GeneratorState, action: GeneratorStateAction) => {
    switch(action.type) {
        case ACTION.SET_GUITAR_TYPE:
            return {
                ...state,
                guitarType: action.payload.guitarType
            }
        case ACTION.SET_NECK_TYPE: 
            return {
                ...state,
                neckType: action.payload.neckType
            }
        case ACTION.SET_HEAD: 
            return {
                ...state,
                head: action.payload.head
            }
        case ACTION.SET_NECK: 
            return {
                ...state,
                neck: action.payload.neck
            }
        case ACTION.SET_WING_SET: 
            return {
                ...state,
                wingSet: action.payload.wingSet
            }
        case ACTION.SET_FACE_PLATE: 
            return {
                ...state,
                facePlate: action.payload.facePlate
            }
        case ACTION.SET_BRIDGE: 
            return {
                ...state,
                bridge: action.payload.bridge
            }
        case ACTION.ADD_EXTRA: 
            return {
                ...state,
                extras: [
                    ...state.extras,
                    action.payload.part
                ]
            }
        case ACTION.RESET: 
            return {
                ...initialState
            }


        default: {
            //@ts-ignore
            return ((x:never) => x)(action)
        }
    }
}

export default reducer;