import React, {useEffect} from 'react';
import {Route, Switch} from "react-router-dom";
import {clientUtil} from "../utils/client.util";
// components
import {SideBar, HeaderBar} from "../components"
// pages
import Login from "./login"
import CustomerAll from "./customer/all"

function Index() {
    let isLogin = true;
    useEffect(() => {
        clientUtil.setErrorHandler();
        clientUtil.setDefaultInterceptors();
    });
    return (
        <>
            {
                !isLogin &&
                <Switch>
                    <Route exact path="/" component={Login}/>
                </Switch>
            }
            {
                isLogin &&
                <>
                    <HeaderBar/>
                    <SideBar/>
                    <div className={"content"}>
                        <Switch>
                            {/* Customer*/}
                            <Route
                                exact path="/customer"
                                component={CustomerAll}
                            />
                        </Switch>
                    </div>
                </>
            }
        </>
    );
}

export default Index;
