import React, { useState, useEffect, useCallback } from "react"
import { useHistory } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { objectUtil } from "../../../utils/object.util"
import { store } from "react-notifications-component"
// constants
import { toatConstant } from "../../../constants/index"
// api
import { userApi } from "../../../api"
// action
import { modalErrorAction, modalLoadingAction } from "../../../actions"
// components
import { Topic, Box, Tables, ModalNormal } from "../../../components"
import { Row, Spinner } from "react-bootstrap"

function MemberAll() {
    let history = useHistory()
    const dispatch = useDispatch()
    const account = useSelector(state => state.account)

    const [column, setColumn] = useState([])
    const [columnKey, setColumnKey] = useState([])
    const { getUserList, resetPasswordUser, deleteUser } = userApi

    const [showModalNormal, setShowModalNormal] = useState(false)
    const [titleModalNormal, setTitleModalNormal] = useState("")
    const [desModalNormal, setDesModalNormal] = useState("")
    const [swapColorModalNormal, setSwapColorModalNormal] = useState(false)
    const [modeModalNormal, setModeModalNormal] = useState("")
    const [id, setId] = useState("")

    const [isLoadData, setIsLoadData] = useState(true)

    const [memberList, setMemberList] = useState();

    let showModalError = useCallback(() => {
        dispatch(modalLoadingAction.close())
        dispatch(modalErrorAction.show())
    }, [dispatch])

    let _getUserList = useCallback((isRefresh) => {
        getUserList().then(({ data }) => {
            let { success, result } = data
            if (success && result.length !== 0) {
                let memberList = result.map((element) => ({
                    ...element,
                    fullName: `${element.firstName} ${element.lastName}`
                }))
                setMemberList(objectUtil.sortArray(memberList, "fullName"))
                setIsLoadData(false)
            } else {
                showModalError()
            }
        }).catch(error => { console.log(error) }).finally(() => {
            if (isRefresh) {
                store.addNotification(toatConstant.deleteDataSuccess())
                dispatch(modalLoadingAction.close())
            }
        })
    }, [getUserList, showModalError, dispatch])

    useEffect(() => {
        _getUserList(false)

        if (account.role === "ADMIN") {
            setColumn(["Full Name", "Phone", "Email", ""])
            setColumnKey(["fullName", "phoneNumber", "email", "menu"])
        } else {
            setColumn(["Full Name", "Phone", "Email"])
            setColumnKey(["fullName", "phoneNumber", "email"])
        }
    }, [_getUserList, account.role])

    let handleClickRow = (data) => {
        history.push(`/member/${data.id}`)
    }

    let handleClickResetPasswordMember = (data) => {
        setTitleModalNormal("Reset Password Member!")
        setDesModalNormal(`Are you sure to reset password (${data["fullName"]})?`)
        setSwapColorModalNormal(true)
        setModeModalNormal("resetPasswordMember")
        setShowModalNormal(true)
        setId(data.id)
    }

    let handleClickDeleteMember = (data) => {
        setTitleModalNormal("Delete Member!")
        setDesModalNormal(`Are you sure to delete (${data["fullName"]})?`)
        setSwapColorModalNormal(true)
        setModeModalNormal("deleteMember")
        setShowModalNormal(true)
        setId(data.id)
    }

    let handleOkModals = () => {
        switch (modeModalNormal) {
            case "resetPasswordMember":
                setShowModalNormal(false)
                dispatch(modalLoadingAction.show())

                resetPasswordUser(id).then(({ data }) => {
                    let { success } = data
                    if (success) {
                        store.addNotification(toatConstant.saveDataSuccess())
                    } else {
                        dispatch(modalErrorAction.show())
                    }
                }).catch(error => { console.log(error) }).finally(() => {
                    dispatch(modalLoadingAction.close())
                })
                break
            case "deleteMember":
                setShowModalNormal(false)
                dispatch(modalLoadingAction.show())

                deleteUser(id).then(({ data }) => {
                    let { success } = data
                    if (success) {
                        _getUserList(true)
                    } else {
                        dispatch(modalLoadingAction.close())
                        dispatch(modalErrorAction.show())
                    }
                }).catch(error => { console.log(error) })
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
                    <Topic title={"Member"} subTitle={"list"} />
                    <Row>
                        <Box xs={12} sm={12} lg={12}
                            body={() => (
                                <>
                                    <Tables
                                        columnLabel={column}
                                        column={columnKey}
                                        row={memberList}
                                        onClickRow={handleClickRow}
                                        onClickResetPassword={handleClickResetPasswordMember}
                                        onClickDelete={handleClickDeleteMember}
                                        pathCreate={account.role === "ADMIN" ? "/member/create" : ""} />
                                </>
                            )} />
                    </Row>
                </>)}
            <ModalNormal title={titleModalNormal} description={desModalNormal} show={showModalNormal} swapColor={swapColorModalNormal}
                handleClose={() => setShowModalNormal(false)} handleOk={handleOkModals} />
        </>
    )
}

export default MemberAll
