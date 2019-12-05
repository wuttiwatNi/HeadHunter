import React, { useState, useEffect, useCallback } from "react"
import { useHistory, useParams } from "react-router-dom"
import { objectUtil } from "../../../utils/object.util"
import { useDispatch } from "react-redux"
import { format, formatDistanceToNow } from "date-fns"
// constants
import { generalConstant } from "../../../constants/index"
// api
import { orderApi, contactApi, skillApi, languageSkillApi, orderSkillApi, orderLanguageSkillApi } from "../../../api"
// action
import { modalErrorAction } from "../../../actions"
import { modalLoadingAction } from "../../../actions"
// components
import { Topic, Box, Tables, ModalForm, ModalNormal, Input, InputSelect, Information, RowContact, RowSkill, RowLanguageSkill, TableSelect } from "../../../components"
import { Row, Col, Spinner } from "react-bootstrap"

function OrderDetail() {
    const history = useHistory()
    const { id } = useParams()

    const dispatch = useDispatch()

    const { getOrder, deleteOrder, editOrderContact } = orderApi
    const { getContactListByCustomerId, editContact } = contactApi
    const { getSkillList } = skillApi;
    const { getLanguageSkillList } = languageSkillApi;
    const { createOrderSkill, deleteOrderSkill } = orderSkillApi
    const { createOrderLanguageSkill, deleteOrderLanguageSkill } = orderLanguageSkillApi

    const [showModalForm, setShowModalForm] = useState(false)
    const [titleModalForm, setTitleModalForm] = useState("")
    const [subTitleModalForm, setSubTitleModalForm] = useState("")
    const [modeModalForm, setModeModalForm] = useState("")

    const [showModalNormal, setShowModalNormal] = useState(false)
    const [titleModalNormal, setTitleModalNormal] = useState("")
    const [desModalNormal, setDesModalNormal] = useState("")
    const [swapColorModalNormal, setSwapColorModalNormal] = useState(false)
    const [modeModalNormal, setModeModalNormal] = useState("")

    const [order, setOrder] = useState()
    const [contact, setContact] = useState([])
    const [skill, setSkill] = useState([])
    const [languageSkill, setLanguageSkill] = useState([])
    const [candidateList] = useState([])//setCandidateList
    const [skillList, setSkillList] = useState([]);
    const [languageSkillList, setLanguageSkillList] = useState([])
    const [contactList, setContactList] = useState([])
    const [dataFromTableSelect, setDataFromTableSelect] = useState({});
    const [dataFromRowSkill, setDataFromRowSkill] = useState({});
    const [dataFromRowLanguageSkill, setDataFromRowLanguageSkill] = useState({});

    const [formDataContact, setFormDataContact] = useState({
        id: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: ""
    })
    const [formDataSkill, setFormDataSkill] = useState({
        skillId: "",
        experience: ""
    })
    const [formDataLanguageSkill, setFormDataLanguageSkill] = useState({
        languageSkillId: "",
        listening: "",
        speaking: "",
        reading: "",
        writing: ""
    })

    let _getOrder = useCallback((isRefresh) => {
        getOrder(id).then(({ data }) => {
            let { success, result } = data
            if (success && result.length !== 0) {
                setOrder({
                    ...result[0],
                    _budget: `${result[0].budget.toLocaleString()} ฿`,
                    _experience: `${result[0].experience} Year`,
                    _obsoleted: `${format(new Date(result[0].obsoleted), "dd-MM-yyyy")} (${formatDistanceToNow(new Date(result[0].obsoleted), { addSuffix: true })})`,
                    _priority: `${objectUtil.mapPriority(result[0].priority)}`,
                    _quantity: `${result[0].success}/${result[0].quantity}`,
                })
                setContact(result[0].contact)
                setSkill(result[0].skill)
                setLanguageSkill(objectUtil.mapDataLanguage(result[0].languageSkill))
                // setCandidateList(result[0].order)
            } else {
                dispatch(modalErrorAction.show())
            }
        }).catch(error => { console.log(error) }).finally(() => {
            if (isRefresh) {
                dispatch(modalLoadingAction.close())
            }
        })
    }, [getOrder, dispatch, id])

    useEffect(() => {
        _getOrder(false)
    }, [_getOrder])

    let handleClickRow = (data) => {
        history.push(`/order/${data.id}`)
    }

    let handleClickRowSelectContact = (data) => {
        setDataFromTableSelect(data)
    }

    let handleClickEditCustomer = () => {
        history.push(`/order/edit/${id}`)
    }

    let handleClickDeleteOrder = () => {
        setTitleModalNormal("Delete Order!")
        setDesModalNormal(`Are you sure to delete (${order["positionName"]})?`)
        setSwapColorModalNormal(true)
        setModeModalNormal("deleteOrder")
        setShowModalNormal(true)
    }

    let handleClickAddSkill = () => {
        setFormDataSkill(objectUtil.clearData(formDataSkill))
        dispatch(modalLoadingAction.show())

        getSkillList().then(({ data }) => {
            let { success, result } = data
            if (success) {
                let _result = result.filter((element) => {
                    let result = true;
                    skill.forEach((elementSkill) => {
                        if (element["id"] === elementSkill["skillId"]) {
                            result = false
                        }
                    })
                    return result
                })
                setSkillList(objectUtil.sortArray(objectUtil.formForInputSelect(_result, "id", "name"), "label"))
                setTitleModalForm("Skill")
                setSubTitleModalForm("add")
                setModeModalForm("addSkill")
                setShowModalForm(true)
            } else {
                dispatch(modalErrorAction.show())
            }
        }).catch(error => { console.log(error) }).finally(() => {
            dispatch(modalLoadingAction.close())
        })
    }

    let handleClickDeleteSkill = (data) => {
        setDataFromRowSkill(data)
        setTitleModalNormal("Delete Skill!")
        setDesModalNormal(`Are you sure to delete (${data["skillName"]})?`)
        setSwapColorModalNormal(true)
        setModeModalNormal("deleteSkill")
        setShowModalNormal(true)
    }

    let handleClickAddLanguageSkill = () => {
        setFormDataLanguageSkill(objectUtil.clearData(formDataLanguageSkill))
        dispatch(modalLoadingAction.show())

        getLanguageSkillList().then(({ data }) => {
            let { success, result } = data
            if (success) {
                let _result = result.filter((element) => {
                    let result = true;
                    languageSkill.forEach((elementSkill) => {
                        if (element["id"] === elementSkill["languageSkillId"]) {
                            result = false
                        }
                    })
                    return result
                })
                setLanguageSkillList(objectUtil.sortArray(objectUtil.formForInputSelect(_result, "id", "name"), "label"))
                setTitleModalForm("Language Skill")
                setSubTitleModalForm("add")
                setModeModalForm("addLanguageSkill")
                setShowModalForm(true)
            } else {
                dispatch(modalErrorAction.show())
            }
        }).catch(error => { console.log(error) }).finally(() => {
            dispatch(modalLoadingAction.close())
        })
    }

    let handleClickDeleteLanguageSkill = (data) => {
        setDataFromRowLanguageSkill(data)
        setTitleModalNormal("Delete Language Skill!")
        setDesModalNormal(`Are you sure to delete (${data["languageSkillName"]})?`)
        setSwapColorModalNormal(true)
        setModeModalNormal("deleteLanguageSkill")
        setShowModalNormal(true)
    }

    let handleClickChangeContact = () => {
        dispatch(modalLoadingAction.show())

        getContactListByCustomerId(order["customerId"]).then(({ data }) => {
            let { success, result } = data
            if (success) {
                setContactList(result.map((element) => ({
                    fullName: `${element["firstName"]} ${element["lastName"]}`,
                    ...element
                })))
                setTitleModalForm("Select contact")
                setSubTitleModalForm("list")
                setModeModalForm("changeContact")
                setShowModalForm(true)
            } else {
                dispatch(modalErrorAction.show())
            }
        }).catch(error => { console.log(error) }).finally(() => {
            dispatch(modalLoadingAction.close())
        })
    }

    let handleClickEditContact = (data) => {
        setFormDataContact(data)
        setTitleModalForm("Contact")
        setSubTitleModalForm("edit")
        setModeModalForm("editContact")
        setShowModalForm(true)
    }

    let handleOkModals = () => {
        switch (modeModalNormal) {
            case "deleteOrder":
                setShowModalNormal(false)
                dispatch(modalLoadingAction.show())

                deleteOrder(id).then(({ data }) => {
                    let { success } = data
                    if (success) {
                        history.replace("/order")
                    } else {
                        dispatch(modalErrorAction.show())
                    }
                }).catch(error => { console.log(error) }).finally(() => {
                    dispatch(modalLoadingAction.close())
                })
                break
            case "deleteSkill":
                setShowModalNormal(false)
                dispatch(modalLoadingAction.show())

                deleteOrderSkill(dataFromRowSkill["id"]).then(({ data }) => {
                    let { success } = data
                    if (success) {
                        _getOrder(true)
                    } else {
                        dispatch(modalLoadingAction.close())
                        dispatch(modalErrorAction.show())
                    }
                }).catch(error => { console.log(error) })
                break
            case "deleteLanguageSkill":
                setShowModalNormal(false)
                dispatch(modalLoadingAction.show())

                deleteOrderLanguageSkill(dataFromRowLanguageSkill["id"]).then(({ data }) => {
                    let { success } = data
                    if (success) {
                        _getOrder(true)
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

    let handleOkModalsForm = () => {
        switch (modeModalForm) {
            case "addSkill":
                let validateAddSkill = objectUtil.formValidate(formDataSkill)
                if (validateAddSkill) {
                    let data = {
                        orderId: id,
                        orderSkill: [formDataSkill]
                    }

                    setShowModalForm(false)
                    dispatch(modalLoadingAction.show())

                    createOrderSkill(data).then(({ data }) => {
                        let { success } = data
                        if (success) {
                            _getOrder(true)
                        } else {
                            dispatch(modalLoadingAction.close())
                            dispatch(modalErrorAction.show())
                        }
                    }).catch(error => { console.log(error) })

                    setFormDataSkill(objectUtil.clearData(formDataSkill))
                }
                break
            case "addLanguageSkill":
                let validateAddLanguageSkill = objectUtil.formValidate(formDataLanguageSkill)
                if (validateAddLanguageSkill) {
                    let data = {
                        orderId: id,
                        orderLanguageSkill: [formDataLanguageSkill]
                    }

                    setShowModalForm(false)
                    dispatch(modalLoadingAction.show())

                    createOrderLanguageSkill(data).then(({ data }) => {
                        let { success } = data
                        if (success) {
                            _getOrder(true)
                        } else {
                            dispatch(modalLoadingAction.close())
                            dispatch(modalErrorAction.show())
                        }
                    }).catch(error => { console.log(error) })

                    setFormDataLanguageSkill(objectUtil.clearData(formDataSkill))
                }
                break
            case "changeContact":
                if (dataFromTableSelect["id"] !== undefined) {
                    setShowModalForm(false)
                    dispatch(modalLoadingAction.show())

                    editOrderContact(id, dataFromTableSelect["id"]).then(({ data }) => {
                        let { success } = data
                        if (success) {
                            _getOrder(true)
                        } else {
                            dispatch(modalLoadingAction.close())
                            dispatch(modalErrorAction.show())
                        }
                    }).catch(error => { console.log(error) })
                } else {
                    setShowModalForm(false)
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
                            _getOrder(true)
                        } else {
                            dispatch(modalLoadingAction.close())
                            dispatch(modalErrorAction.show())
                        }
                    }).catch(error => { console.log(error) })
                }
                break
            default:
                break
        }
    }

    let handleChangeInput = ({ target }) => {
        switch (modeModalForm) {
            case "addSkill":
                formDataSkill[target.id] = target.value
                break
            case "addLanguageSkill":
                formDataLanguageSkill[target.id] = target.value
                break
            case "editContact":
                formDataContact[target.id] = target.value
                break
            default:
                break
        }
    }

    return (
        <>
            {!order ? (
                <div className={"spinner"}>
                    <Spinner animation="grow" variant="primary" />
                </div>) :
                (<>
                    <Topic title={order["positionName"]} subTitle={"order"} onClickDelete={handleClickDeleteOrder} />
                    <Row>
                        <Col xs={12} sm={12} lg={4} className={"no-padding"}>
                            <Row>
                                <Box title={"Information"} icon={"fa-pencil"} onClickIcon={handleClickEditCustomer} xs={12} sm={12} lg={12}
                                    body={() => (
                                        <Information data={order}
                                            keyValue={[
                                                { label: "Company", key: "companyName" },
                                                { label: "Order", key: "positionName" },
                                                { label: "Budget", key: "_budget" },
                                                { label: "Experience", key: "_experience" },
                                                { label: "Priority", key: "_priority" },
                                                { label: "Quantity", key: "_quantity" },
                                                { label: "Obsoleted", key: "_obsoleted" }]} />
                                    )} />
                                <Box title={"Skill"} icon={"fa-plus"} onClickIcon={handleClickAddSkill} xs={12} sm={12} lg={12}
                                    body={() => (
                                        <RowSkill data={skill} onClickDelete={handleClickDeleteSkill} />
                                    )} />
                                <Box title={"Language"} icon={"fa-plus"} onClickIcon={handleClickAddLanguageSkill} xs={12} sm={12} lg={12}
                                    body={() => (
                                        <RowLanguageSkill data={languageSkill} onClickDelete={handleClickDeleteLanguageSkill} />
                                    )} />
                                <Box title={"Contact"} icon={"fa-exchange"} onClickIcon={handleClickChangeContact} xs={12} sm={12} lg={12}
                                    body={() => (
                                        <RowContact mode={"orderDetail"} data={contact} onClickEdit={handleClickEditContact} />
                                    )} />
                            </Row>
                        </Col>
                        <Box xs={12} sm={12} lg={8} body={() => (
                            <>
                                <Tables
                                    columnLabel={["Order", "Budget", "Priority"]}
                                    column={["positionName", "budget", "priority"]}
                                    row={candidateList}
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
                form={() =>
                    <>
                        {modeModalForm === "addSkill" &&
                            <Row>
                                <InputSelect xs={12} sm={12} lg={12} label={"Skill"} id={"skillId"} optionsList={skillList} onChange={handleChangeInput} isSearchable={true} />
                                <Input xs={12} sm={12} lg={12} label={"Experience"} id={"experience"} onChange={handleChangeInput} type={"number"} unit={"Year"} />
                            </Row>
                        }
                        {modeModalForm === "addLanguageSkill" &&
                            <Row>
                                <InputSelect xs={12} sm={12} lg={12} label={"Language Skill"} id={"languageSkillId"} optionsList={languageSkillList} onChange={handleChangeInput} isSearchable={true} />
                                <InputSelect xs={6} sm={6} lg={6} label={"Listening"} id={"listening"} placeholder={"listening"} optionsList={generalConstant.priorityList} onChange={handleChangeInput} />
                                <InputSelect xs={6} sm={6} lg={6} label={"Speaking"} id={"speaking"} placeholder={"speaking"} optionsList={generalConstant.priorityList} onChange={handleChangeInput} />
                                <InputSelect xs={6} sm={6} lg={6} label={"Reading"} id={"reading"} placeholder={"reading"} optionsList={generalConstant.priorityList} onChange={handleChangeInput} />
                                <InputSelect xs={6} sm={6} lg={6} label={"Writing"} id={"writing"} placeholder={"writing"} optionsList={generalConstant.priorityList} onChange={handleChangeInput} />
                            </Row>
                        }
                        {modeModalForm === "changeContact" &&
                            <Row>
                                <TableSelect
                                    column={["fullName", "email", "phoneNumber"]}
                                    row={contactList}
                                    onClickRow={handleClickRowSelectContact} />
                            </Row>
                        }
                        {modeModalForm === "editContact" &&
                            <Row>
                                <Col xs={12} sm={12} lg={12} className={"no-padding"}>
                                    <Row>
                                        <Input xs={6} sm={6} lg={6} label={"First name"} id={"firstName"} onChange={handleChangeInput} defaultValue={formDataContact.firstName} />
                                        <Input xs={6} sm={6} lg={6} label={"Last name"} id={"lastName"} onChange={handleChangeInput} defaultValue={formDataContact.lastName} />
                                    </Row>
                                </Col>
                                <Input xs={12} sm={12} lg={12} label={"Email"} id={"email"} onChange={handleChangeInput} defaultValue={formDataContact.email} />
                                <Input xs={12} sm={12} lg={12} label={"Phone"} id={"phoneNumber"} onChange={handleChangeInput} defaultValue={formDataContact.phoneNumber} />
                                <Input id={"id"} isHidden={true} defaultValue={formDataContact.id} />
                            </Row>
                        }
                    </>
                } />
        </>
    )
}

export default OrderDetail
