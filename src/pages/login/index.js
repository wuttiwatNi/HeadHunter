import React, { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { Col, Row } from "react-bootstrap"
// api
import { userApi } from "../../api"
// action
import { modalErrorAction, modalLoadingAction, accountAction } from "../../actions"
import "./index.scss";

function Login() {
    const dispatch = useDispatch()

    const [errorEmail, setErrorEmail] = useState("")
    const [errorPassword, setErrorPassword] = useState("")

    const { signInUser } = userApi

    const [formDataLogin] = useState({
        email: "",
        password: ""
    })

    useEffect(() => {
        var input = document.getElementById("password");

        input.addEventListener("keyup", function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                document.getElementById("btn-login").click();
            }
        });
    })

    let handleChangeInput = ({ target }) => {
        formDataLogin[target.id] = target.value
        if (target.id === "email")
            setErrorEmail("")
        else
            setErrorPassword("")
    }

    let handleLogin = () => {
        let validate = true
        if (formDataLogin.email.length === 0) {
            setErrorEmail("(Is a required.)")
            validate = false
        }
        if (formDataLogin.password.length === 0) {
            setErrorPassword("(Is a required.)")
            validate = false
        } else if (formDataLogin.password.length < 6) {
            setErrorPassword("(Must be at least 6 characters.)")
            validate = false
        }

        if (validate) {
            dispatch(modalLoadingAction.show())

            signInUser(formDataLogin).then(({ data }) => {
                let { success, result } = data
                if (success) {
                    dispatch(accountAction.login(result[0]))
                } else {
                    dispatch(modalErrorAction.setDes(data.message) + ".")
                    dispatch(modalErrorAction.show())
                }
            }).catch(error => { console.log(error) }).finally(() => {
                dispatch(modalLoadingAction.close())
            })
        }
    }

    return (
        <>
            <div className={"login"}>
                <div className={"block-row"}>
                    <Row>
                        <Col xs={12} sm={{ span: 8, offset: 2 }} lg={{ span: 4, offset: 4 }}>
                            <div className={"block"}>
                                <img
                                    src={`${window.location.origin}/logo-square.png`}
                                    className="logo"
                                    alt="notFound"
                                />
                                <span className={"title"}>Welcome</span>
                                <div className={"label"}>Email</div>
                                <div className={"error"}>{errorEmail}</div>
                                <input id={"email"} onChange={handleChangeInput} />
                                <div className={"label"}>Password</div>
                                <div className={"error"}>{errorPassword}</div>
                                <input id={"password"} onChange={handleChangeInput} type={"password"} />
                                <button id={"btn-login"} className={"primary-fill"} onClick={() => handleLogin()}>Login</button>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    )
}

export default Login
