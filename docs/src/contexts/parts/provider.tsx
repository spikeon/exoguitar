import { ReactNode, useMemo, useReducer } from "react"
import initialState from "./initialState"
import { PartsActionsContext, PartsContext } from "./context"
import reducer from "./reducer"
import getActions from "./actions"
import { Part } from "../../types/Parts"
import sectionsData from "../../data/sections.json"

type PartsProviderProps = {
    data: Part[],
    children: ReactNode
}

export const PartsProvider = ({data = [], children}: PartsProviderProps) => {
    const [state, dispatch] = useReducer(reducer, { 
        ...initialState, 
        parts: data, 
        sections: sectionsData.map((section) => ({
            name: section.name,
            parts: data.filter((p) => section.name === p.section)
        }))
    })
    const actions = useMemo(()=> getActions(dispatch), [])

    return (
        <PartsActionsContext.Provider value={actions}>
            <PartsContext.Provider value={state}>
                {children}
            </PartsContext.Provider>
        </PartsActionsContext.Provider>
    )
}