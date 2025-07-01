import { createContext, useContext } from "react";
import { GeneratorStateActions } from "./types";
import { GeneratorState } from "../../types/State";

export const GeneratorStateActionsContext = createContext<GeneratorStateActions>(null!)
export const useGeneratorStateActionsContext = () => useContext(GeneratorStateActionsContext)

export const GeneratorStateContext = createContext<GeneratorState>(null!)
export const useGeneratorStateContext = () => useContext(GeneratorStateContext)