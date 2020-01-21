import React from "react"
import { Route, Switch, Redirect } from "react-router-dom"
import { useSelector } from "react-redux"
import ReactNotification from 'react-notifications-component'
// components
import { SideBar, HeaderBar, ModalError, ModalLoading } from "../components"
// pages
import Login from "./login"
import CustomerAll from "./customer/all"
import CustomerCreate from "./customer/create"
import CustomerDetail from "./customer/detail"
import OrderAll from "./order/all"
import OrderCreate from "./order/create"
import OrderDetail from "./order/detail"
import CandidateAll from "./candidate/all"
import CandidateCreate from "./candidate/create"
import CandidateDetail from "./candidate/detail"
import Option from "./option"
import MemberAll from "./member/all"
import MemberCreate from "./member/create"
import 'react-notifications-component/dist/theme.css'

function Index() {
    const account = useSelector(state => state.account)
    let { token } = account

    return (
        <>
            {
                !token &&
                <Switch>
                    <Route exact path="/" component={Login} />
                    <Route path="/*" render={() => <Redirect to="/" />} />
                </Switch>
            }
            {
                token &&
                <>
                    <SideBar />
                    <HeaderBar />
                    <div className={"content"}>
                        <Switch>
                            {/* Customer */}
                            <Route exact path="/" render={() => <Redirect to="/customer" />} />
                            <Route
                                exact path={"/customer"}
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
                            {/* Order */}
                            <Route
                                exact path={"/order"}
                                component={OrderAll}
                            />
                            <Route
                                exact path="/order/create"
                                render={() => (
                                    <OrderCreate mode={"create"} />
                                )}
                            />
                            <Route
                                exact path="/order/edit/:id"
                                render={() => (
                                    <OrderCreate mode={"edit"} />
                                )}
                            />
                            <Route
                                exact path={["/order/:id"]}
                                component={OrderDetail}
                            />
                            {/* Candidate */}
                            <Route
                                exact path={"/candidate"}
                                component={CandidateAll}
                            />
                            <Route
                                exact path="/candidate/create"
                                render={() => (
                                    <CandidateCreate mode={"create"} />
                                )}
                            />
                            <Route
                                exact path="/candidate/edit/:id"
                                render={() => (
                                    <CandidateCreate mode={"edit"} />
                                )}
                            />
                            <Route
                                exact path={["/candidate/:id"]}
                                component={CandidateDetail}
                            />
                            {/* Member */}
                            <Route
                                exact path={"/member"}
                                component={MemberAll}
                            />
                            {account.role === "ADMIN" &&
                                <Route
                                    exact path="/member/create"
                                    render={() => (
                                        <MemberCreate mode={"create"} />
                                    )}
                                />
                            }
                            <Route
                                exact path="/member/:id"
                                render={() => (
                                    <MemberCreate mode={"detail"} />
                                )}
                            />
                            <Route
                                exact path="/profile"
                                render={() => (
                                    <MemberCreate mode={"edit"} />
                                )}
                            />
                            {/* Option */}
                            <Route
                                exact path={"/option"}
                                component={Option}
                            />
                            <Route path="/*" render={() => <Redirect to="/customer" />} />
                        </Switch>
                    </div>
                </>
            }
            <ReactNotification />
            <ModalLoading />
            <ModalError />
        </>
    )
}

export default Index
