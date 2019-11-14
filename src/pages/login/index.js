import React, {useState} from "react";
import {ModalNormal} from "../../components"
import {objectUtil} from "../../utils/object.util";
import {Col, Row} from "react-bootstrap";
import "./index.scss";

function Login() {
    const [showMessage, setShowMessage] = useState(false);
    const [formDataLogin] = useState({
        username: "",
        password: ""
    });

    let handleChangeInput = ({target}) => {
        formDataLogin[target.id] = target.value
    };

    let handleLogin = () => {
        let validate = objectUtil.formValidate(formDataLogin);
        if (!validate) {

        } else {
            console.log(formDataLogin)
        }
    };

    return (
        <>
            <div className={"login"}>
                <div className={"block-row"}>
                    <Row>
                        <Col xs={12} sm={{span: 8, offset: 2}} lg={{span: 4, offset: 4}}>
                            <div className={"block"}>
                                <img
                                    src={`${window.location.origin}/logo-square.png`}
                                    className="logo"
                                    alt="notFound"
                                />
                                <span className={"title"}>Welcome</span>
                                <input id={"username"} onChange={handleChangeInput} placeholder={"Username"}/>
                                <input id={"password"} onChange={handleChangeInput} placeholder={"Password"}/>
                                <div className={"forgot"}>Forgot password?</div>
                                <button className={"primary-fill"} onClick={() => handleLogin()}>Login</button>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
            <ModalNormal title={"Oop!"} description={"Something went wrong."} show={showMessage}
                         handleOk={() => setShowMessage(false)}/>
        </>
    );
}

export default Login;
