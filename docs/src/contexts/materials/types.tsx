import {Material} from "../../types/Materials";

export type MaterialsState = {
    Materials: Material[]
}

export enum ACTION {
    SET_BILL_OF_MATERIALS, 
    ADD_BILL_OF_MATERIALS_MATERIAL,
    REMOVE_BILL_OF_MATERIALS_MATERIAL,
    UPDATE_BILL_OF_MATERIALS_MATERIAL
}

type SetMaterialsAction = {
    type: ACTION.SET_BILL_OF_MATERIALS,
    payload: {
        Materials: Material[]
    }
}

type addMaterialsMaterial = {
    type: ACTION.ADD_BILL_OF_MATERIALS_MATERIAL,
    payload: {
        material: Material
    }
}

type updateMaterialsMaterial = {
    type: ACTION.UPDATE_BILL_OF_MATERIALS_MATERIAL,
    payload: {
        material: Material
    }
}

type removeMaterialsMaterial = {
    type: ACTION.REMOVE_BILL_OF_MATERIALS_MATERIAL,
    payload: {
        material: Material
    }
}

export type MaterialsAction = SetMaterialsAction | addMaterialsMaterial | updateMaterialsMaterial | removeMaterialsMaterial;

export type MaterialsActions = {
    setMaterials: (Materials: Material[]) => void
    addMaterialsMaterial : (material:Material) => void
    updateMaterialsMaterial : (material:Material) => void
    removeMaterialsMaterial : (material: Material) => void
}