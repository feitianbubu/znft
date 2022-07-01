import React from "react";

import Panel from "./panel";
import ContextProvider from "./context";

const LoginDrawer :React.FC = ()=>{

    return<ContextProvider>
        <Panel/>
    </ContextProvider>
}
export  default  React.memo(LoginDrawer)
