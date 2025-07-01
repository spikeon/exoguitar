import { ACTION, GeneratorStateAction } from "./types";
import { GeneratorState } from "../../types/State";

const reducer = (state: GeneratorState, action: GeneratorStateAction) => {
    switch(action.type) {
        case ACTION.SET_GUITAR_TYPE:
            return {
                ...state,
                guitarType: action.payload.guitarType
            }
        case ACTION.UNSET_GUITAR_TYPE: 
            return {
                ...state,
                guitarType: undefined
            }
        case ACTION.SET_HEAD: 
            return {
                ...state,
                head: action.payload.head
            }
        case ACTION.UNSET_HEAD: 
            return {
                ...state,
                head: undefined
            }
        case ACTION.SET_NECK: 
            return {
                ...state,
                neck: action.payload.neck
            }
        case ACTION.UNSET_NECK: 
            return {
                ...state,
                neck: undefined
            }
        case ACTION.SET_WING_SET: 
            return {
                ...state,
                wingSet: action.payload.wingSet
            }
        case ACTION.UNSET_WING_SET: 
            return {
                ...state,
                wingSet: undefined
            }
        case ACTION.SET_FACE_PLATE: 
            return {
                ...state,
                facePlate: action.payload.facePlate
            }
        case ACTION.UNSET_FACE_PLATE: 
            return {
                ...state,
                facePlate: undefined
            }
        case ACTION.SET_BRIDGE: 
            return {
                ...state,
                bridge: action.payload.bridge
            }
        case ACTION.UNSET_BRIDGE: 
            return {
                ...state,
                bridge: undefined
            }


            default: {
            //@ts-ignore
            return ((x:never) => x)(action)
        }
    }
}

export default reducer;