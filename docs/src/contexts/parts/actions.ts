import { Dispatch } from "react";
import { ACTION, PartsAction, PartsActions } from "./types";
import { Part } from "../../types/Parts";

const getActions = (dispatch: Dispatch<PartsAction>): PartsActions => ({
    setParts: (parts: Part[]) => {
        dispatch({
            type: ACTION.SET_PARTS,
            payload: {
                parts,
            }
        });
    },
    addPartsPart: function (part: Part): void {
        dispatch({
            type: ACTION.ADD_PARTS_PART,
            payload: {
                part,
            }
        });
    },
    removePartsPart: function (part: Part): void {
        dispatch({
            type: ACTION.REMOVE_PARTS_PART,
            payload: {
                part,
            }
        });
    }
})

export default getActions;