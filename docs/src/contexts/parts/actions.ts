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
})

export default getActions;