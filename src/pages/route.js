import React, {useEffect} from "react";
import {Route, Switch} from "react-router-dom";
import {clientUtil} from "../utils/client.util";
// components
import {SideBar, HeaderBar} from "../components"
// pages
import Login from "./login"
import CustomerAll from "./customer/all"
import CustomerCreate from "./customer/create"

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
                    <SideBar/>
                    <HeaderBar/>
                    <div className={"content"}>
                        <Switch>
                            {/* Customer*/}
                            <Route
                                exact path={["/", "/customer"]}
                                component={CustomerAll}
                            />
                            <Route
                                exact path="/customer/create"
                                render={() => (
                                    <CustomerCreate mode={"create"}/>
                                )}
                            />
                        </Switch>
                    </div>
                </>
            }
        </>
    );
}

export default Index;
