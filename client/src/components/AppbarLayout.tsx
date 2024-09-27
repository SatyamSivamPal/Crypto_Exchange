import React from "react";
import Appbar from "./Appbar"

type AppbarLayoutProps = {
    children: React.ReactNode
}

const AppbarLayout: React.FC<AppbarLayoutProps> = ({children}) => {
    return(
        <div>
            <Appbar/>
            <main>
                {children}
            </main>
        </div>
    )
}

export default AppbarLayout;