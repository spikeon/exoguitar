import { Dispatch } from "react";
import { ACTION, MaterialsAction, MaterialsActions } from "./types";
import { Material } from "../../types/Materials";

const getActions = (dispatch: Dispatch<MaterialsAction>): MaterialsActions => ({
    setMaterials: (Materials: Material[]) => {
        dispatch({
            type: ACTION.SET_BILL_OF_MATERIALS,
            payload: {
                Materials,
            }
        });
    },
    addMaterialsMaterial: function (material: Material): void {
        dispatch({
            type: ACTION.ADD_BILL_OF_MATERIALS_MATERIAL,
            payload: {
                material,
            }
        });
    },
    updateMaterialsMaterial: function (material: Material): void {
        dispatch({
            type: ACTION.UPDATE_BILL_OF_MATERIALS_MATERIAL,
            payload: {
                material,
            }
        });
    },
    removeMaterialsMaterial: function (material: Material): void {
        dispatch({
            type: ACTION.REMOVE_BILL_OF_MATERIALS_MATERIAL,
            payload: {
                material,
            }
        });
    }
})

export default getActions;