import { ReactNode, useMemo, useReducer } from "react"
import initialState from "./initialState"
import { PartsActionsContext, PartsContext } from "./context"
import reducer from "./reducer"
import getActions from "./actions"
import { Part } from "../../types/Parts"

type PartsProviderProps = {
    data: Part[],
    children: ReactNode
}

export const PartsProvider = ({data = [], children}: PartsProviderProps) => {
    const [state, dispatch] = useReducer(reducer, { ...initialState, parts: data })
    const actions = useMemo(()=> getActions(dispatch), [])

    return (
        <PartsActionsContext.Provider value={actions}>
            <PartsContext.Provider value={state}>
                {children}
            </PartsContext.Provider>
        </PartsActionsContext.Provider>
    )
}