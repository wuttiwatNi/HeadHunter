import React from "react";
import { Route, Switch } from "react-router-dom";
import { clientUtil } from "../utils/client.util";
// components
import { SideBar, HeaderBar, ModalError, ModalLoading } from "../components"
// pages
import Login from "./login"
import CustomerAll from "./customer/all"
import CustomerCreate from "./customer/create"
import CustomerDetail from "./customer/detail"

function Index() {
    let isLogin = true;

    clientUtil.setErrorHandler();
    clientUtil.setDefaultInterceptors();

    return (
        <>
            {
                !isLogin &&
                <Switch>
                    <Route exact path="/" component={Login} />
                </Switch>
            }
            {
                isLogin &&
                <>
                    <SideBar />
                    <HeaderBar />
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
                                    <CustomerCreate mode={"create"} />
                                )}
                            />
                            <Route
                                exact path="/customer/edit/:id"
                                render={() => (
                                    <CustomerCreate mode={"edit"} />
                                )}
                            />
                            <Route
                                exact path={["/customer/:id"]}
                                component={CustomerDetail}
                            />
                        </Switch>
                    </div>
                </>
            }
            <ModalLoading />
            <ModalError />
        </>
    );
}

export default Index;
