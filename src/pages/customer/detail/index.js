import React, { useState, useEffect, useCallback } from "react"
import { useHistory, useParams } from "react-router-dom"
import { objectUtil } from "../../../utils/object.util"
import { useDispatch } from "react-redux"
import { store } from "react-notifications-component"
// constants
import { toatConstant } from "./../../../constants/index"
// api
import { customerApi, contactApi } from "../../../api"
// action
import { modalErrorAction } from "../../../actions"
import { modalLoadingAction } from "../../../actions"
// components
import { Topic, Box, Tables, ModalForm, ModalNormal, Input, Information, RowContact } from "../../../components"
import { Row, Col, Spinner } from "react-bootstrap"

function CustomerDetail() {
    const history = useHistory()
    const { id } = useParams()

    const dispatch = useDispatch()

    const { getCustomer, deleteCustomer } = customerApi
    const { createContact, editContact, deleteContact } = contactApi

    const [showModalForm, setShowModalForm] = useState(false)
    const [titleModalForm, setTitleModalForm] = useState("")
    const [subTitleModalForm, setSubTitleModalForm] = useState("")
    const [modeModalForm, setModeModalForm] = useState("")

    const [showModalNormal, setShowModalNormal] = useState(false)
    const [titleModalNormal, setTitleModalNormal] = useState("")
    const [desModalNormal, setDesModalNormal] = useState("")
    const [swapColorModalNormal, setSwapColorModalNormal] = useState(false)
    const [modeModalNormal, setModeModalNormal] = useState("")

    const [customer, setCustomer] = useState()
    const [contact, setContact] = useState([])
    const [orderList, setOrderList] = useState([])
    const [dataFromRowContact, setDataFromRowContact] = useState({})

    const [formDataContact, setFormDataContact] = useState({
        id: "",
        customerId: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: ""
    })

    let _getCustomer = useCallback((isRefresh, isDelete) => {
        getCustomer(id).then(({ data }) => {
            let { success, result } = data
            if (success && result.length !== 0) {
                setCustomer(result[0])
                setContact(result[0].contact)
                setOrderList(result[0].order)
            } else {
                dispatch(modalErrorAction.goBack())
                dispatch(modalErrorAction.setDes("Not found customer. Please try again later."))
                dispatch(modalErrorAction.show())
            }
        }).catch(error => { console.log(error) }).finally(() => {
            if (isRefresh) {
                if (isDelete)
                    store.addNotification(toatConstant.deleteDataSuccess())
                else
                    store.addNotification(toatConstant.saveDataSuccess())
                dispatch(modalLoadingAction.close())
            }
        })
    }, [getCustomer, dispatch, id])

    useEffect(() => {
        _getCustomer(false, false)
    }, [_getCustomer])

    let handleClickRow = (data) => {
        history.push(`/order/${data.id}`)
    }

    let handleClickEditCustomer = () => {
        history.push(`/customer/edit/${id}`)
    }

    let handleClickDeleteCustomer = () => {
        setTitleModalNormal("Delete Customer!")
        setDesModalNormal(`Are you sure to delete (${customer["companyName"]})?`)
        setSwapColorModalNormal(true)
        setModeModalNormal("deleteCustomer")
        setShowModalNormal(true)
    }

    let handleClickCreateContact = () => {
        setFormDataContact(objectUtil.clearData(formDataContact))
        setTitleModalForm("Contact")
        setSubTitleModalForm("create")
        setModeModalForm("createContact")
        setShowModalForm(true)
    }

    let handleClickEditContact = (data) => {
        setFormDataContact(data)

        setTitleModalForm("Contact")
        setSubTitleModalForm("edit")
        setModeModalForm("editContact")
        setShowModalForm(true)
    }

    let handleClickDeleteContact = (data) => {
        setDataFromRowContact(data)
        setTitleModalNormal("Delete Contact!")
        setDesModalNormal(`Are you sure to delete (${data["firstName"]} ${data["lastName"]})?`)
        setSwapColorModalNormal(true)
        setModeModalNormal("deleteContact")
        setShowModalNormal(true)
    }

    let handleOkModals = () => {
        switch (modeModalNormal) {
            case "deleteCustomer":
                setShowModalNormal(false)
                dispatch(modalLoadingAction.show())

                deleteCustomer(id).then(({ data }) => {
                    let { success } = data
                    if (success) {
                        store.addNotification(toatConstant.deleteDataSuccess())
                        history.replace("/customer")
                    } else {
                        dispatch(modalErrorAction.show())
                    }
                }).catch(error => { console.log(error) }).finally(() => {
                    dispatch(modalLoadingAction.close())
                })
                break
            case "deleteContact":
                setShowModalNormal(false)
                dispatch(modalLoadingAction.show())

                deleteContact(dataFromRowContact["id"]).then(({ data }) => {
                    let { success } = data
                    if (success) {
                        _getCustomer(true, true)
                    } else {
                        dispatch(modalErrorAction.show())
                    }
                }).catch(error => { console.log(error) }).finally(() => {
                    dispatch(modalLoadingAction.close())
                })
                break
            default:
                break
        }
    }

    let handleOkModalsForm = () => {
        switch (modeModalForm) {
            case "createContact":
                formDataContact.id = "-"
                formDataContact.customerId = id
                let validate = objectUtil.formValidate(formDataContact)
                if (validate) {
                    setShowModalForm(false)
                    dispatch(modalLoadingAction.show())

                    createContact(formDataContact).then(({ data }) => {
                        let { success } = data
                        if (success) {
                            _getCustomer(true, false)
                        } else {
                            dispatch(modalLoadingAction.close())
                            dispatch(modalErrorAction.show())
                        }
                    }).catch(error => { console.log(error) })
                }
                break
            case "editContact":
                let validateEditContact = objectUtil.formValidate(formDataContact)
                if (validateEditContact) {
                    setShowModalForm(false)
                    dispatch(modalLoadingAction.show())

                    editContact(formDataContact).then(({ data }) => {
                        let { success } = data
                        if (success) {
                            _getCustomer(true, false)
                        } else {
                            dispatch(modalLoadingAction.close())
                            dispatch(modalErrorAction.show())
                        }
                    }).catch(error => { console.log(error) })

                    setFormDataContact(objectUtil.clearData(formDataContact))
                }
                break
            default:
                break
        }
    }

    let handleChangeInput = ({ target }) => {
        formDataContact[target.id] = target.value
    }

    return (
        <>
            {!customer ? (
                <div className={"spinner"}>
                    <Spinner animation="grow" variant="primary" />
                </div>) :
                (<>
                    <Topic title={customer["companyName"]} subTitle={"customer"} onClickDelete={handleClickDeleteCustomer} />
                    <Row>
                        <Col xs={12} sm={12} lg={4} className={"no-padding"}>
                            <Row>
                                <Box title={"Information"} icon={"fa-pencil"} onClickIcon={handleClickEditCustomer} xs={12} sm={12} lg={12}
                                    body={() => (
                                        <Information data={customer}
                                            keyValue={[
                                                { label: "Company", key: "companyName" },
                                                { label: "Tax", key: "taxNumber" },
                                                { label: "Phone", key: "phoneNumber" },
                                                { label: "Address", key: "address" },
                                                { label: "Provice", key: "provinceName" },
                                                { label: "Amphure", key: "amphureName" },
                                                { label: "District", key: "districtName" },
                                                { label: "Zip code", key: "zipCode" }]} />
                                    )} />
                                <Box title={"Contact"} icon={"fa-plus"} onClickIcon={handleClickCreateContact} xs={12} sm={12} lg={12}
                                    body={() => (
                                        <RowContact data={contact} onClickEdit={handleClickEditContact} onClickDelete={handleClickDeleteContact} />
                                    )} />
                            </Row>
                        </Col>
                        <Box xs={12} sm={12} lg={8} body={() => (
                            <>
                                <Tables
                                    columnLabel={["Order", "Budget", "Priority"]}
                                    column={["positionName", "budget", "priority"]}
                                    row={orderList}
                                    onClickRow={handleClickRow}
                                    pathCreate={"/order/create"} />
                            </>
                        )} />
                    </Row>
                </>)}
            <ModalNormal title={titleModalNormal} description={desModalNormal} show={showModalNormal} swapColor={swapColorModalNormal}
                handleClose={() => setShowModalNormal(false)} handleOk={handleOkModals} />
            <ModalForm title={titleModalForm} subTitle={subTitleModalForm} show={showModalForm}
                handleClose={() => setShowModalForm(false)} handleOk={handleOkModalsForm}
                form={() => (
                    <Row>
                        <Col xs={12} sm={12} lg={12} className={"no-padding"}>
                            <Row>
                                <Input xs={12} sm={6} lg={6} label={"First name"} id={"firstName"} onChange={handleChangeInput} defaultValue={formDataContact.firstName} />
                                <Input xs={12} sm={6} lg={6} label={"Last name"} id={"lastName"} onChange={handleChangeInput} defaultValue={formDataContact.lastName} />
                            </Row>
                        </Col>
                        <Input xs={12} sm={12} lg={12} label={"Email"} id={"email"} onChange={handleChangeInput} defaultValue={formDataContact.email} />
                        <Input xs={12} sm={12} lg={12} label={"Phone"} id={"phoneNumber"} onChange={handleChangeInput} defaultValue={formDataContact.phoneNumber} />
                        <Input id={"customerId"} isHidden={true} defaultValue={formDataContact.customerId} />
                        <Input id={"id"} isHidden={true} defaultValue={formDataContact.id} />
                    </Row>
                )} />
        </>
    )
}

export default CustomerDetail
