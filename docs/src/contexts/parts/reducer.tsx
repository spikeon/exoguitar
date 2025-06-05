import { ACTION, PartsAction, PartsState } from "./types";

const reducer = (state: PartsState, action: PartsAction) => {
    switch(action.type) {
        case ACTION.SET_PARTS: 
            return {
                ...state,
                parts: action.payload.parts
            }

            default: {
            //@ts-ignore
            return ((x:never) => x)(action)
        }
    }
}

export default reducer;