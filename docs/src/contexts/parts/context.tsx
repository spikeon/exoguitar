import { createContext, useContext } from "react";
import { PartsActions, PartsState } from "./types";

export const PartsActionsContext = createContext<PartsActions>(null!)
export const usePartsActionsContext = () => useContext(PartsActionsContext)

export const PartsContext = createContext<PartsState>(null!)
export const usePartsContext = () => useContext(PartsContext)