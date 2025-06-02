import { ACTION, MaterialsAction, MaterialsState } from "./types";

const reducer = (state: MaterialsState, action: MaterialsAction) => {
    switch(action.type) {
        case ACTION.SET_BILL_OF_MATERIALS: 
            return {
                ...state,
                Materials: action.payload.Materials
            }

        case ACTION.ADD_BILL_OF_MATERIALS_MATERIAL: 
            return {
                ...state,
                Materials: [
                    ...state.Materials.filter((a) => a.name !== action.payload.material.name),
                    action.payload.material
                ]
            }

        case ACTION.UPDATE_BILL_OF_MATERIALS_MATERIAL:
            return {
                ...state,
                Materials: [
                    ...state.Materials.filter((a) => a.name !== action.payload.material.name),
                    {
                        ...action.payload.material,
                        qty: action.payload.material.qty + (state.Materials.find((a) => a.name === action.payload.material.name)?.qty || 0)
                    }
                ]
            }

        case ACTION.REMOVE_BILL_OF_MATERIALS_MATERIAL: {
            return {
                ...state,
                Materials: [
                    ...state.Materials.filter((a) => a.name !== action.payload.material.name)
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