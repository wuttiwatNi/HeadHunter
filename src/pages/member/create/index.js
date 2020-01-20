import React, { useState, useEffect, useCallback } from "react"
import { useHistory, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { objectUtil } from "../../../utils/object.util"
import { store } from "react-notifications-component"
// constants
import { toatConstant } from "../../../constants/index"
// api
import { userApi } from "../../../api"
// action
import { modalErrorAction, modalLoadingAction, accountAction } from "../../../actions"
// components
import { Topic, Box, Input, ModalNormal } from "../../../components"
import { Row, Col, Spinner } from "react-bootstrap"

function MemberCreate({ mode }) {
    let history = useHistory()
    const account = useSelector(state => state.account)
    const dispatch = useDispatch()
    const { id } = useParams()

    const [isReset, setIsReset] = useState(false)
    const [isLoadData, setIsLoadData] = useState(true)

    const { createUser, getUser, editUser, changePasswordUser } = userApi

    const [showModalNormal, setShowModalNormal] = useState(false)
    const [titleModalNormal, setTitleModalNormal] = useState("")
    const [desModalNormal, setDesModalNormal] = useState("")
    const [swapColorModalNormal, setSwapColorModalNormal] = useState(false)
    const [modeModalNormal, setModeModalNormal] = useState("")

    const [urlProfile, setUrlProfile] = useState("")
    const [currentMember, setCurrentMember] = useState({})
    const [formDataMember] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
        picture: {},
    })
    const [formDataChangePassword, setFormDataChangePassword] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    })

    const [errorPassword, setErrorPassword] = useState("")
    const [errorConfirmPassword, setErrorConfirmPassword] = useState("")

    const [errorCurrentPassword, setErrorCurrentPassword] = useState("")
    const [errorNewPassword, setErrorNewPassword] = useState("")
    const [errorConfirmNewPassword, setErrorConfirmNewPassword] = useState("")

    // let showModalError = useCallback(() => {
    //     dispatch(modalLoadingAction.close())
    //     dispatch(modalErrorAction.show())
    // }, [dispatch])

    let _handleReset = useCallback((data) => {
        formDataMember.firstName = data.firstName
        formDataMember.lastName = data.lastName
        formDataMember.phoneNumber = data.phoneNumber
        formDataMember.picture = {}
        setUrlProfile(data.picturePath)

        setIsReset(true)
        setTimeout(() => {
            setIsReset(false)
        }, 1)
    }, [formDataMember])

    let _getUser = useCallback((isRefresh) => {
        let _id
        if (mode === "edit") {
            _id = account.id
        } else {
            _id = id
        }
        getUser(_id).then(({ data }) => {
            let { success, result } = data
            if (success && result.length !== 0) {
                formDataMember.id = result[0].id
                formDataMember.firstName = result[0].firstName
                formDataMember.lastName = result[0].lastName
                formDataMember.phoneNumber = result[0].phoneNumber
                formDataMember.email = result[0].email
                result[0].fullName = `${result[0].firstName} ${result[0].lastName}`

                let _picturePath = result[0].picturePath.split("/")
                let pictureName = _picturePath[_picturePath.length - 1]

                result[0].pictureName = pictureName

                if (mode === "edit") {
                    dispatch(accountAction.updateProfile(result[0]))
                }
                setUrlProfile(result[0].picturePath)
                setCurrentMember(result[0])
                _handleReset(result[0])
                setIsLoadData(false)
            } else {
                dispatch(modalLoadingAction.close())
                dispatch(modalErrorAction.goBack())
                dispatch(modalErrorAction.setDes("Not found member. Please try again later."))
                dispatch(modalErrorAction.show())
            }
        }).catch(error => { console.log(error) }).finally(() => {
            if (isRefresh) {
                store.addNotification(toatConstant.saveDataSuccess())
                dispatch(modalLoadingAction.close())
            }
        })
    }, [getUser, formDataMember, id, mode, account.id, dispatch, _handleReset])

    useEffect(() => {
        if (mode === "create") {
            setIsLoadData(false)
        } else {
            setIsLoadData(true)
            _getUser(false)
        }
    }, [setIsLoadData, _getUser, mode, dispatch])

    let handleDiscard = () => {
        setTitleModalNormal("Discard!")
        setDesModalNormal("Are you sure to discard?")
        setSwapColorModalNormal(true)
        setModeModalNormal("discard")
        setShowModalNormal(true)
    }

    let handleReset = () => {
        formDataMember.firstName = currentMember.firstName
        formDataMember.lastName = currentMember.lastName
        formDataMember.phoneNumber = currentMember.phoneNumber
        formDataMember.picture = {}
        setUrlProfile(currentMember.picturePath)

        setIsReset(true)
        setTimeout(() => {
            setIsReset(false)
        }, 1)
    }

    let handleCreate = () => {
        if (mode === "edit") {
            delete formDataMember.password
            delete formDataMember.confirmPassword
        }
        let validate = objectUtil.formValidate(formDataMember)

        if (mode === "create") {
            if (formDataMember.password.length > 0 && formDataMember.password.length < 6) {
                document.getElementById("password").scrollIntoView({ behavior: "smooth", block: "center" })
                document.getElementById("password").classList.add("invalid")
                setErrorPassword("Password must be at least 6 characters.")

                validate = false
            }
            if (formDataMember.password !== formDataMember.confirmPassword) {
                document.getElementById("confirmPassword").scrollIntoView({ behavior: "smooth", block: "center" })
                document.getElementById("confirmPassword").classList.add("invalid")
                setErrorConfirmPassword("Confirm password not match.")

                validate = false
            }
        }

        if (validate) {
            setTitleModalNormal(`${mode === "create" ? "Create" : "Edit"}!`)
            setDesModalNormal(`Are you sure to ${mode === "create" ? "Create" : "Edit"}?`)
            setSwapColorModalNormal(false)
            setModeModalNormal(`${mode === "create" ? "createMember" : "editMember"}`)
            setShowModalNormal(true)
        }
    }

    let handleChangePassword = () => {
        let validate = objectUtil.formValidate(formDataChangePassword)

        if (formDataChangePassword.currentPassword.length > 0 && formDataChangePassword.currentPassword.length < 6) {
            document.getElementById("currentPassword").scrollIntoView({ behavior: "smooth", block: "center" })
            document.getElementById("currentPassword").classList.add("invalid")
            setErrorCurrentPassword("Current password must be at least 6 characters.")

            validate = false
        }
        if (formDataChangePassword.newPassword.length > 0 && formDataChangePassword.newPassword.length < 6) {
            document.getElementById("newPassword").scrollIntoView({ behavior: "smooth", block: "center" })
            document.getElementById("newPassword").classList.add("invalid")
            setErrorNewPassword("New password must be at least 6 characters.")

            validate = false
        }
        if (formDataChangePassword.newPassword !== formDataChangePassword.confirmNewPassword) {
            document.getElementById("confirmNewPassword").scrollIntoView({ behavior: "smooth", block: "center" })
            document.getElementById("confirmNewPassword").classList.add("invalid")
            setErrorConfirmNewPassword("Confirm new password not match.")

            validate = false
        }

        if (validate) {
            setTitleModalNormal("Change Password!")
            setDesModalNormal("Are you sure to change password?")
            setSwapColorModalNormal(false)
            setModeModalNormal("changePassword")
            setShowModalNormal(true)
        }
    }

    let handleOkModals = () => {
        switch (modeModalNormal) {
            case "createMember":
                var formDataCreateMember = new FormData()

                for (var key1 in formDataMember) {
                    formDataCreateMember.append(key1, formDataMember[key1])
                }

                setShowModalNormal(false)
                dispatch(modalLoadingAction.show())

                createUser(formDataCreateMember).then(({ data }) => {
                    let { success, result } = data
                    if (success) {
                        store.addNotification(toatConstant.saveDataSuccess())
                        history.replace(result[0].id.toString())
                    } else {
                        dispatch(modalErrorAction.show())
                    }
                }).catch(error => { console.log(error) }).finally(() => {
                    dispatch(modalLoadingAction.close())
                })
                break
            case "editMember":
                var formDataEditMember = new FormData()

                for (var key2 in formDataMember) {
                    formDataEditMember.append(key2, formDataMember[key2])
                }

                setShowModalNormal(false)
                dispatch(modalLoadingAction.show())

                editUser(formDataEditMember).then(({ data }) => {
                    let { success } = data
                    if (success) {
                        _getUser(true)
                    } else {
                        dispatch(modalLoadingAction.close())
                        dispatch(modalErrorAction.show())
                    }
                }).catch(error => { console.log(error) })
                break
            case "changePassword":
                let dataChangePassword = {
                    oldPassword: formDataChangePassword.currentPassword,
                    newPassword: formDataChangePassword.newPassword
                }

                setShowModalNormal(false)
                dispatch(modalLoadingAction.show())

                changePasswordUser(dataChangePassword).then(({ data }) => {
                    let { success } = data
                    if (success) {
                        setFormDataChangePassword(objectUtil.clearData(formDataChangePassword))
                        document.getElementById("currentPassword").value = ""
                        document.getElementById("newPassword").value = ""
                        document.getElementById("confirmNewPassword").value = ""
                        store.addNotification(toatConstant.saveDataSuccess())
                    } else {
                        dispatch(modalErrorAction.setDes(data.message + "."))
                        dispatch(modalErrorAction.show())
                    }
                }).catch(error => { console.log(error) }).finally(() => {
                    dispatch(modalLoadingAction.close())
                })
                break
            case "discard":
                history.goBack()
                break
            default:
                break
        }
    }

    let handleChangeInput = ({ target }) => {
        let { id, value } = target

        if (target.type === "file") {
            if (target.files.length !== 0) {
                let typeFileAccept = target.accept.toString().split(",")
                let typeFile = "." + target.files[0].type.toString().split("/")[1]
                if (typeFileAccept.indexOf(typeFile) !== -1) {
                    formDataMember[id] = target.files[0]
                    setUrlProfile(URL.createObjectURL(target.files[0]))
                } else {
                    formDataMember[id] = {}
                    if (mode === "create")
                        setUrlProfile("")
                    else
                        setUrlProfile(currentMember.picturePath)
                }
            } else {
                formDataMember[id] = {}
                if (mode === "create")
                    setUrlProfile("")
                else
                    setUrlProfile(currentMember.picturePath)
            }
        } else {
            formDataMember[id] = value
        }

        switch (id) {
            case "password":
                document.getElementById(id).classList.remove("invalid")
                setErrorPassword("")
                break
            case "confirmPassword":
                document.getElementById(id).classList.remove("invalid")
                setErrorConfirmPassword("")
                break
            default:
                break
        }
    }

    let handleChangeInputChangePassword = ({ target }) => {
        let { id, value } = target

        formDataChangePassword[id] = value

        switch (id) {
            case "currentPassword":
                document.getElementById(id).classList.remove("invalid")
                setErrorCurrentPassword("")
                break
            case "newPassword":
                document.getElementById(id).classList.remove("invalid")
                setErrorNewPassword("")
                break
            case "confirmNewPassword":
                document.getElementById(id).classList.remove("invalid")
                setErrorConfirmNewPassword("")
                break
            default:
                break
        }
    }

    return (
        <>
            {isLoadData ? (
                <div className={"spinner"}>
                    <Spinner animation="grow" variant="primary" />
                </div>) :
                (<>
                    <Topic title={`${mode === "create" ? "Member" : currentMember.fullName}`} subTitle={`${mode === "create" ? mode : "member"}`} />
                    <Row>
                        <Box xs={12} sm={12} lg={12}
                            body={() => (
                                <Row>
                                    <Col xs={0} sm={2} lg={4} />
                                    <Col xs={12} sm={8} lg={4} >
                                        <div style={{
                                            display: "block",
                                            borderRadius: "8px 8px 8px 8px",
                                            color: "rgba(0, 0, 0, 0.5)",
                                            background: "rgba(0, 165, 146, 0.4)",
                                            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                                            padding: "5px 15px",
                                            fontSize: "18px",
                                            fontWeight: 400,
                                            marginBottom: 15
                                        }}>
                                            Personal information
                                                </div>
                                    </Col>
                                    <Col xs={0} sm={2} lg={4} />

                                    <Col xs={0} sm={2} lg={4} />
                                    <Col xs={12} sm={8} lg={4} >
                                        <div style={{ display: "flex", backgroundColor: "rgba(0, 0, 0, 0.05)", marginBottom: 15 }}>
                                            <img src={`${urlProfile === "" ? `${window.location.origin}/user-avatar.png` : urlProfile}`} alt="..." style={{
                                                width: 150,
                                                height: 200,
                                                margin: "15px auto",
                                                objectFit: "cover",
                                                borderRadius: 5,
                                                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.3)"
                                            }} />
                                        </div>
                                    </Col>
                                    <Col xs={0} sm={2} lg={4} />
                                    {mode !== "detail" &&
                                        <>
                                            <Col xs={0} sm={2} lg={4} />
                                            <Input xs={12} sm={8} lg={4} label={"Profile"} warning={"jpg, jpeg, png"} id={"picture"} onChange={handleChangeInput} defaultNameFile={currentMember.pictureName} type={"file"} typeFile=".jpg,.jpeg,.png" resest={isReset} />
                                            <Col xs={0} sm={2} lg={4} />
                                        </>
                                    }
                                    <Col xs={0} sm={2} lg={4} />
                                    <Input xs={12} sm={8} lg={4} label={"First Name"} id={"firstName"} onChange={handleChangeInput} defaultValue={currentMember.firstName} resest={isReset} isDisabled={mode === "detail"} />
                                    <Col xs={0} sm={2} lg={4} />
                                    <Col xs={0} sm={2} lg={4} />
                                    <Input xs={12} sm={8} lg={4} label={"Last Name"} id={"lastName"} onChange={handleChangeInput} defaultValue={currentMember.lastName} resest={isReset} isDisabled={mode === "detail"} />
                                    <Col xs={0} sm={2} lg={4} />
                                    <Col xs={0} sm={2} lg={4} />
                                    <Input xs={12} sm={8} lg={4} label={"Phone"} id={"phoneNumber"} onChange={handleChangeInput} defaultValue={currentMember.phoneNumber} resest={isReset} isDisabled={mode === "detail"} />
                                    <Col xs={0} sm={2} lg={4} />
                                    <Col xs={0} sm={2} lg={4} />
                                    <Input xs={12} sm={8} lg={4} label={"Email"} id={"email"} onChange={handleChangeInput} defaultValue={currentMember.email} resest={isReset} isDisabled={mode === "detail" || mode === "edit"} />
                                    <Col xs={0} sm={2} lg={4} />
                                    {mode === "create" &&
                                        <>
                                            <Col xs={0} sm={2} lg={4} />
                                            <Input xs={12} sm={8} lg={4} label={"Password"} warning={errorPassword} id={"password"} onChange={handleChangeInput} type={"password"} />
                                            <Col xs={0} sm={2} lg={4} />
                                            <Col xs={0} sm={2} lg={4} />
                                            <Input xs={12} sm={8} lg={4} label={"Confirm Password"} warning={errorConfirmPassword} id={"confirmPassword"} onChange={handleChangeInput} type={"password"} />
                                            <Col xs={0} sm={2} lg={4} />
                                        </>
                                    }
                                    {mode === "edit" &&
                                        <>
                                            <Col xs={0} sm={2} lg={4} />
                                            <Col xs={12} sm={8} lg={4} >
                                                <button onClick={handleReset} className="outline-primary-blue" style={{ width: "calc(50% - 5px)", display: "inline-block", marginRight: 5 }}>Reset</button>

                                                <button onClick={handleCreate} className="outline-primary" style={{ width: "calc(50% - 5px)", display: "inline-block", marginLeft: 5 }}>Edit</button>
                                            </Col>
                                            <Col xs={0} sm={2} lg={4} />

                                            <Col xs={0} sm={2} lg={4} />
                                            <Col xs={12} sm={8} lg={4} >
                                                <div style={{
                                                    display: "block",
                                                    borderRadius: "8px 8px 8px 8px",
                                                    color: "rgba(0, 0, 0, 0.5)",
                                                    background: "rgba(0, 165, 146, 0.4)",
                                                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                                                    padding: "5px 15px",
                                                    fontSize: "18px",
                                                    fontWeight: 400,
                                                    marginTop: 30,
                                                    marginBottom: 15
                                                }}>
                                                    Change Password
                                                </div>
                                            </Col>
                                            <Col xs={0} sm={2} lg={4} />

                                            <Col xs={0} sm={2} lg={4} />
                                            <Input xs={12} sm={8} lg={4} label={"Current Password"} warning={errorCurrentPassword} id={"currentPassword"} onChange={handleChangeInputChangePassword} type={"password"} />
                                            <Col xs={0} sm={2} lg={4} />
                                            <Col xs={0} sm={2} lg={4} />
                                            <Input xs={12} sm={8} lg={4} label={"New Password"} warning={errorNewPassword} id={"newPassword"} onChange={handleChangeInputChangePassword} type={"password"} />
                                            <Col xs={0} sm={2} lg={4} />
                                            <Col xs={0} sm={2} lg={4} />
                                            <Input xs={12} sm={8} lg={4} label={"Confirm New Password"} warning={errorConfirmNewPassword} id={"confirmNewPassword"} onChange={handleChangeInputChangePassword} type={"password"} />
                                            <Col xs={0} sm={2} lg={4} />

                                            <Col xs={0} sm={2} lg={4} />
                                            <Col xs={12} sm={8} lg={4} >
                                                <button onClick={handleChangePassword} className="outline-primary" style={{ width: "100%" }}>Save</button>
                                            </Col>
                                            <Col xs={0} sm={2} lg={4} />
                                        </>
                                    }
                                </Row>
                            )}
                            footer={() => (
                                (mode === "detail" || mode === "edit") ? null :
                                    <Row>
                                        <Col xs={6}>
                                            <button onClick={handleDiscard} className="outline-primary-red">Discard</button>
                                        </Col>
                                        <Col xs={6} className={"text-right"}>
                                            <button onClick={handleCreate} className="outline-primary">Create</button>
                                        </Col>
                                    </Row>
                            )}
                        />
                    </Row>
                </>)}
            <ModalNormal title={titleModalNormal} description={desModalNormal} show={showModalNormal} swapColor={swapColorModalNormal}
                handleClose={() => setShowModalNormal(false)} handleOk={handleOkModals} />
        </>
    )
}

export default MemberCreate
