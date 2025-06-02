import { createContext, useContext } from "react";
import { MaterialsActions, MaterialsState } from "./types";

export const MaterialsActionsContext = createContext<MaterialsActions>(null!)
export const useMaterialsActionsContext = () => useContext(MaterialsActionsContext)

export const MaterialsContext = createContext<MaterialsState>(null!)
export const useMaterialsContext = () => useContext(MaterialsContext)