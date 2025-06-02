import { ReactNode, useMemo, useReducer } from "react"
import initialState from "./initialState"
import { MaterialsActionsContext, MaterialsContext } from "./context"
import reducer from "./reducer"
import getActions from "./actions"

type MaterialsProviderProps = {
    children: ReactNode
}

export const MaterialsProvider = ({children}: MaterialsProviderProps) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const actions = useMemo(()=> getActions(dispatch), [])

    return (
        <MaterialsActionsContext.Provider value={actions}>
            <MaterialsContext.Provider value={state}>
                {children}
            </MaterialsContext.Provider>
        </MaterialsActionsContext.Provider>
    )
}