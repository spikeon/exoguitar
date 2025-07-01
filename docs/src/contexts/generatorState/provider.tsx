import { ReactNode, useMemo, useReducer } from "react"
import initialState from "./initialState"
import { GeneratorStateActionsContext, GeneratorStateContext } from "./context"
import reducer from "./reducer"
import getActions from "./actions"

export const GeneratorStateProvider = ({children} : {children: ReactNode}) => {
    const [state, dispatch] = useReducer(reducer, { ...initialState } );
    
    const actions = useMemo(()=> getActions(dispatch), [])

    return (
        <GeneratorStateActionsContext.Provider value={actions}>
            <GeneratorStateContext.Provider value={state}>
                {children}
            </GeneratorStateContext.Provider>
        </GeneratorStateActionsContext.Provider>
    )
}