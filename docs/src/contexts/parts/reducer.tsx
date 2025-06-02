import { ACTION, PartsAction, PartsState } from "./types";

const reducer = (state: PartsState, action: PartsAction) => {
    switch(action.type) {
        case ACTION.SET_PARTS: 
            return {
                ...state,
                parts: action.payload.parts
            }

        case ACTION.ADD_PARTS_PART: 
            return {
                ...state,
                parts: [
                    ...state.parts.filter((a) => a.name !== action.payload.part.name),
                    action.payload.part
                ]
            }

        case ACTION.REMOVE_PARTS_PART: {
            return {
                ...state,
                parts: [
                    ...state.parts.filter((a) => a.name !== action.payload.part.name)
                ]
            }

        }
        default: {
            //@ts-ignore
            return ((x:never) => x)(action)
        }
    }
}

export default reducer;