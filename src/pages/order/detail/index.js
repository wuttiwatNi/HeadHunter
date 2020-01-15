import React, { useState, useEffect, useCallback } from "react"
import { useHistory, useParams } from "react-router-dom"
import { objectUtil } from "../../../utils/object.util"
import { useDispatch } from "react-redux"
import { format, formatDistanceToNow } from "date-fns"
// api
import { orderApi, candidateApi, contactApi } from "../../../api"
// action
import { modalErrorAction } from "../../../actions"
import { modalLoadingAction } from "../../../actions"
// components
import { Topic, Box, Tables, ModalForm, ModalNormal, Input, Information, RowContact, RowSkill, RowLanguageSkill, TableSelect, RowActivity } from "../../../components"
import { Row, Col, Spinner, Tab, Tabs } from "react-bootstrap"

function OrderDetail() {
    const history = useHistory()
    const { id } = useParams()

    const dispatch = useDispatch()
    const [isLoadData, setIsLoadData] = useState(true)

    const { getOrder, deleteOrder, editOrderContact } = orderApi
    const { getCandidateList } = candidateApi
    const { getContactListByCustomerId, editContact } = contactApi

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
    const [candidateList, setCandidateList] = useState([])
    const [contactList, setContactList] = useState([])
    const [activity, setActivity] = useState([])
    const [dataFromTableSelect, setDataFromTableSelect] = useState({})

    const [formDataContact, setFormDataContact] = useState({
        id: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: ""
    })

    let _getOrder = useCallback(() => {
        return new Promise(function (resolve, reject) {
            getOrder(id).then(({ data }) => {
                let { success, result } = data
                if (success && result.length !== 0) {
                    let activity = result[0]["activity"].map((element) => {
                        return {
                            ...element,
                            createdDate: format(new Date(element.createdDate), "dd MMM. yyyy"),
                            createdTime: format(new Date(element.createdDate), "HH:mm")
                        }
                    })
                    activity = objectUtil.sortArrayNumberReverse(activity, "id")
                    let countDay = ""
                    activity = activity.map((element) => {
                        if (countDay === element.createdDate) {
                            countDay = element.createdDate
                            return {
                                ...element,
                                isSameDay: false
                            }
                        } else {
                            countDay = element.createdDate
                            return {
                                ...element,
                                isSameDay: true
                            }
                        }
                    })

                    setOrder({
                        ...result[0],
                        _budget: `${result[0].budget.toLocaleString()} ฿`,
                        _experience: `${result[0].experience} Year`,
                        _obsoleted: `${format(new Date(result[0].obsoleted), "dd-MM-yyyy")} (${formatDistanceToNow(new Date(result[0].obsoleted), { addSuffix: true })})`,
                        _priority: `${objectUtil.mapPriority(result[0].priority)}`,
                        _quantity: `${result[0].success}/${result[0].quantity}`,
                    })
                    setContact(result[0].contact)
                    setActivity(activity)
                    setSkill(result[0].skill)
                    setLanguageSkill(objectUtil.mapDataLanguage(result[0].languageSkill))
                    resolve()
                } else {
                    reject()
                }
            }).catch(error => { console.log(error) })
        })
    }, [getOrder, id])

    let _getCandidateList = useCallback(() => {
        return new Promise(function (resolve, reject) {
            getCandidateList().then(({ data }) => {
                let { success, result } = data
                if (success) {
                    setCandidateList(objectUtil.sortArray(objectUtil.mapDataCandidate(result), "fullName"))
                    resolve()
                } else {
                    reject()
                }
            }).catch(error => { console.log(error) })
        })
    }, [getCandidateList])

    let getDetail = useCallback((isRefresh) => {
        Promise.all([_getOrder(), _getCandidateList()]).then((result) => {
            setIsLoadData(false)
        }).catch(() => {
            dispatch(modalErrorAction.show())
        }).finally(() => {
            if (isRefresh) {
                dispatch(modalLoadingAction.close())
            }
        })
    }, [_getOrder, _getCandidateList, dispatch])

    useEffect(() => {
        getDetail(false)
    }, [getDetail])

    let handleClickRow = (data) => {
        history.push(`/candidate/${data.id}`)
    }

    let handleClickRowSelectContact = (data) => {
        setDataFromTableSelect(data)
    }

    let handleClickEditOrder = () => {
        history.push(`/order/edit/${id}`)
    }

    let handleClickDeleteOrder = () => {
        setTitleModalNormal("Delete Order!")
        setDesModalNormal(`Are you sure to delete (${order["positionName"]})?`)
        setSwapColorModalNormal(true)
        setModeModalNormal("deleteOrder")
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
            default:
                break
        }
    }

    let handleOkModalsForm = () => {
        switch (modeModalForm) {
            case "changeContact":
                if (dataFromTableSelect["id"] !== undefined) {
                    setShowModalForm(false)
                    dispatch(modalLoadingAction.show())

                    editOrderContact(id, dataFromTableSelect["id"]).then(({ data }) => {
                        let { success } = data
                        if (success) {
                            getDetail(true)
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
                            getDetail(true)
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
            case "editContact":
                formDataContact[target.id] = target.value
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
                    <Topic title={order["positionName"]} subTitle={"order"} onClickDelete={handleClickDeleteOrder} />
                    <Row>
                        <Col xs={12} sm={12} lg={4} className={"no-padding"}>
                            <Row>
                                <Box title={"Information"} icon={"fa-pencil"} onClickIcon={handleClickEditOrder} xs={12} sm={12} lg={12}
                                    body={() => (
                                        <Information data={order}
                                            keyValue={[
                                                { label: "Company", key: "companyName" },
                                                { label: "Order", key: "positionName" },
                                                { label: "Budget", key: "_budget" },
                                                { label: "Experience", key: "_experience" },
                                                { label: "Priority", key: "_priority" },
                                                { label: "Quantity", key: "_quantity" },
                                                { label: "Obsoleted", key: "_obsoleted", full: true }]} />
                                    )} />
                                <Box title={"Skill"} xs={12} sm={12} lg={12}
                                    body={() => (
                                        <RowSkill data={skill} />
                                    )} />
                                <Box title={"Language"} xs={12} sm={12} lg={12}
                                    body={() => (
                                        <RowLanguageSkill data={languageSkill} />
                                    )} />
                                <Box title={"Contact"} icon={"fa-exchange"} onClickIcon={handleClickChangeContact} xs={12} sm={12} lg={12}
                                    body={() => (
                                        <RowContact mode={"orderDetail"} data={contact} onClickEdit={handleClickEditContact} />
                                    )} />
                            </Row>
                        </Col>
                        <Box xs={12} sm={12} lg={8} body={() => (
                            <Tabs defaultActiveKey="activity">
                                <Tab eventKey="activity" title="Activity">
                                    <RowActivity data={activity} isOrder={true} />
                                    {/* onClickEdit={handleClickEditActivity} onClickDelete={handleClickDeleteActivity} /> */}
                                </Tab>
                                <Tab eventKey="candidate" title="Candidate">
                                    <Tables
                                        columnLabel={["Full Name", "Email", "Phone"]}
                                        column={["fullName", "email", "phoneNumber"]}
                                        row={candidateList}
                                        onClickRow={handleClickRow}
                                        pathCreate={"/candidate/create"} />
                                </Tab>
                            </Tabs>
                        )} />
                    </Row>
                </>)}
            <ModalNormal title={titleModalNormal} description={desModalNormal} show={showModalNormal} swapColor={swapColorModalNormal}
                handleClose={() => setShowModalNormal(false)} handleOk={handleOkModals} />
            <ModalForm title={titleModalForm} subTitle={subTitleModalForm} show={showModalForm}
                handleClose={() => setShowModalForm(false)} handleOk={handleOkModalsForm}
                form={() =>
                    <>
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