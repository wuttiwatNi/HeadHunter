import React, { useState, useEffect, useCallback } from "react"
import { useHistory, useParams } from "react-router-dom"
import { objectUtil } from "../../../utils/object.util"
import { useDispatch } from "react-redux"
import { format, formatDistanceToNow } from "date-fns"
import { store } from "react-notifications-component"
import { differenceInMonths } from "date-fns"
// constants
import { generalConstant, toatConstant } from "../../../constants/index"
// api
import { orderApi, candidateApi, contactApi, activityApi } from "../../../api"
// action
import { modalErrorAction } from "../../../actions"
import { modalLoadingAction } from "../../../actions"
// components
import { Topic, Box, Tables, ModalForm, ModalNormal, Input, InputSelect, Information, RowContact, RowSkill, RowLanguageSkill, TableSelect, RowActivity } from "../../../components"
import { Row, Col, Spinner, Tab, Tabs } from "react-bootstrap"

function OrderDetail() {
    const history = useHistory()
    const { id } = useParams()

    const dispatch = useDispatch()
    const [isLoadData, setIsLoadData] = useState(true)

    const { getOrder, deleteOrder, editOrderContact } = orderApi
    const { getCandidateList } = candidateApi
    const { getContactListByCustomerId, editContact } = contactApi
    const { createActivity, editActivity, deleteActivity } = activityApi

    const [showModalForm, setShowModalForm] = useState(false)
    const [titleModalForm, setTitleModalForm] = useState("")
    const [subTitleModalForm, setSubTitleModalForm] = useState("")
    const [modeModalForm, setModeModalForm] = useState("")

    const [showModalNormal, setShowModalNormal] = useState(false)
    const [titleModalNormal, setTitleModalNormal] = useState("")
    const [desModalNormal, setDesModalNormal] = useState("")
    const [swapColorModalNormal, setSwapColorModalNormal] = useState(false)
    const [modeModalNormal, setModeModalNormal] = useState("")
    const [idDelete, setIdDelete] = useState("")

    const [formDataActivity, setFormDataActivity] = useState({
        id: "",
        candidateId: "",
        customerId: "",
        orderId: "",
        activityTypeId: "",
        activityNote: ""
    })
    const [isActivityAboutSaraly, setIsActivityAboutSaraly] = useState(false)
    const [isTabActivity, setIsTabActivity] = useState(true)

    const [order, setOrder] = useState()
    const [contact, setContact] = useState([])
    const [skill, setSkill] = useState([])
    const [languageSkill, setLanguageSkill] = useState([])
    const [candidateList, setCandidateList] = useState([])
    const [candidateListForSelect, setCandidateListForSelect] = useState([])
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
                            _createdDate: element.createdDate,
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
                    resolve(result[0])
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
                    result = objectUtil.mapDataCandidate(result)
                    setCandidateListForSelect(objectUtil.sortArray(objectUtil.formForInputSelect(result, "id", "fullName"), "label"))
                    let candidateList = objectUtil.sortArray(result, "fullName")
                    resolve(candidateList)
                } else {
                    reject()
                }
            }).catch(error => { console.log(error) })
        })
    }, [getCandidateList])

    let getDetail = useCallback((isRefresh, isDelete) => {
        Promise.all([_getOrder(), _getCandidateList()]).then((result) => {
            let candidateList = result[1].map((element) => {
                let percent = 0

                // Cal percent position
                percent = percent +
                    result[0]["positionId"] === element["positionAppliedFirst"] ? 20 :
                    result[0]["positionId"] === element["positionAppliedSecond"] ? 10 : 0

                // Cal percent experience
                let scoreworkingMathList = []
                element["working"].filter((i) => {
                    let _result = false
                    if (i["positionId"] === result[0]["positionId"]) {

                        let month = differenceInMonths(new Date(i.endDate), new Date(i.startDate))

                        scoreworkingMathList.push(month)
                        _result = true
                    }
                    return _result
                })

                let sumMonth = scoreworkingMathList.reduce((a, b) => a + b, 0)
                let year = 0
                while (sumMonth >= 12) {
                    sumMonth = sumMonth - 12
                    year++
                }
                percent = percent + parseInt(year >= result[0]["experience"] ? 20 : parseInt((20 * year) / result[0]["experience"]))

                // Cal percent budget
                percent = percent +
                    (result[0]["budget"] >= element["salaryExpect"] ? 20 :
                        element["salaryExpect"] - result[0]["budget"] > 5000 ? 0 : 20 - (((element["salaryExpect"] - result[0]["budget"]) / 1000) * 4))

                // Cal percent languageSkill
                if (result[0]["languageSkill"].length === 0) {
                    percent = percent + 20
                } else {
                    let scoreLanguageSkillMathList = []
                    element["languageSkill"].forEach((i) => {
                        result[0]["languageSkill"].forEach((j) => {
                            if (i["languageSkillId"] === j["languageSkillId"]) {
                                let need = j["listening"] + j["speaking"] + j["reading"] + j["writing"]
                                let have = i["listening"] + i["speaking"] + i["reading"] + i["writing"]
                                scoreLanguageSkillMathList.push(have >= need ? 20 : parseInt((20 * have) / need))
                            }
                        })
                    })

                    while (scoreLanguageSkillMathList.length !== result[0]["languageSkill"].length)
                        scoreLanguageSkillMathList.push(0)

                    let sum = scoreLanguageSkillMathList.reduce((a, b) => a + b, 0)
                    if (sum > 0)
                        percent = percent + parseInt(sum / scoreLanguageSkillMathList.length)
                }

                // Cal percent skill
                if (result[0]["skill"].length === 0) {
                    percent = percent + 20
                } else {
                    let scoreSkillMathList = []
                    element["skill"].forEach((i) => {
                        result[0]["skill"].forEach((j) => {
                            if (i["skillId"] === j["skillId"]) {

                                scoreSkillMathList.push(i["experience"] >= j["experience"] ? 20 : parseInt((20 * i["experience"]) / j["experience"]))
                            }
                        })
                    })

                    while (scoreSkillMathList.length !== result[0]["skill"].length)
                        scoreSkillMathList.push(0)

                    let sum = scoreSkillMathList.reduce((a, b) => a + b, 0)
                    if (sum > 0)
                        percent = percent + parseInt(sum / scoreSkillMathList.length)
                }

                return {
                    ...element,
                    matching: percent
                }
            })

            setCandidateList(objectUtil.sortArrayNumberReverse(candidateList, "matching"))

            setIsLoadData(false)
        }).catch(() => {
            dispatch(modalErrorAction.goBack())
            dispatch(modalErrorAction.setDes("Not found order. Please try again later."))
            dispatch(modalErrorAction.show())
        }).finally(() => {
            if (isRefresh) {
                if (isDelete)
                    store.addNotification(toatConstant.deleteDataSuccess())
                else
                    store.addNotification(toatConstant.saveDataSuccess())
                dispatch(modalLoadingAction.close())
            }
        })
    }, [_getOrder, _getCandidateList, dispatch])

    useEffect(() => {
        getDetail(false, false)
    }, [getDetail])

    let handleClickRow = (data) => {
        window.open(`/candidate/${data.id}`, '_blank')
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

    let handleClickDeleteActivity = (data) => {
        setTitleModalNormal("Delete Activity!")
        setDesModalNormal(`Are you sure to delete (${objectUtil.mapActivityTypeId(data.activityTypeId)} : ${data.candidateFirstName} ${data.candidateLastName})?`)
        setSwapColorModalNormal(true)
        setModeModalNormal("deleteActivity")
        setIdDelete(data.id)
        setShowModalNormal(true)
    }

    let handleClickCreateActivity = () => {
        dispatch(modalLoadingAction.show())
        setIsActivityAboutSaraly(false)

        delete formDataActivity.salary

        getCandidateList().then(({ data }) => {
            let { success, result } = data
            if (success) {
                result = objectUtil.mapDataCandidate(result)

                setCandidateListForSelect(objectUtil.sortArray(objectUtil.formForInputSelect(result, "id", "fullName"), "label"))
                setFormDataActivity(objectUtil.clearData(formDataActivity))
                setTitleModalForm("Activity")
                setSubTitleModalForm("create")
                setModeModalForm("createActivity")
                setShowModalForm(true)
            } else {
                dispatch(modalErrorAction.show())
            }
        }).catch(error => { console.log(error) }).finally(() => {
            dispatch(modalLoadingAction.close())
        })
    }

    let handleClickEditActivity = (data) => {
        formDataActivity.id = data.id
        formDataActivity.candidateId = data.candidateId
        formDataActivity.customerId = data.customerId
        formDataActivity.orderId = data.orderId
        formDataActivity.activityTypeId = data.activityTypeId
        formDataActivity.activityNote = data.activityNote

        setIsActivityAboutSaraly(false)

        delete formDataActivity.salary

        if (data.activityTypeId === 6 || data.activityTypeId === 8) {
            setIsActivityAboutSaraly(true)
            formDataActivity.salary = data.salary
        }

        dispatch(modalLoadingAction.show())

        Promise.all([_getCandidateList()]).then((result) => {
            setTitleModalForm("Activity")
            setSubTitleModalForm("edit")
            setModeModalForm("editActivity")
            setShowModalForm(true)
        }).catch(() => { dispatch(modalErrorAction.show()) }).finally(() => {
            dispatch(modalLoadingAction.close())
        })
    }

    let handleOkModals = () => {
        switch (modeModalNormal) {
            case "deleteOrder":
                setShowModalNormal(false)
                dispatch(modalLoadingAction.show())

                deleteOrder(id).then(({ data }) => {
                    let { success } = data
                    if (success) {
                        store.addNotification(toatConstant.deleteDataSuccess())
                        history.replace("/order")
                    } else {
                        dispatch(modalErrorAction.show())
                    }
                }).catch(error => { console.log(error) }).finally(() => {
                    dispatch(modalLoadingAction.close())
                })
                break
            case "deleteActivity":
                setShowModalNormal(false)
                dispatch(modalLoadingAction.show())

                deleteActivity(idDelete).then(({ data }) => {
                    let { success } = data
                    if (success) {
                        getDetail(true, true)
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
            case "changeContact":
                if (dataFromTableSelect["id"] !== undefined) {
                    setShowModalForm(false)
                    dispatch(modalLoadingAction.show())

                    editOrderContact(id, dataFromTableSelect["id"]).then(({ data }) => {
                        let { success } = data
                        if (success) {
                            getDetail(true, false)
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
                            getDetail(true, false)
                        } else {
                            dispatch(modalLoadingAction.close())
                            dispatch(modalErrorAction.show())
                        }
                    }).catch(error => { console.log(error) })
                }
                break
            case "createActivity":
                formDataActivity.id = "-"
                formDataActivity.customerId = order.customerId
                formDataActivity.orderId = order.id
                let validateCreateActivity = objectUtil.formValidate(formDataActivity)
                if (validateCreateActivity) {
                    setShowModalForm(false)
                    dispatch(modalLoadingAction.show())

                    createActivity(formDataActivity).then(({ data }) => {
                        let { success } = data
                        if (success) {
                            getDetail(true, false)
                        } else {
                            dispatch(modalLoadingAction.close())
                            dispatch(modalErrorAction.show())
                        }
                    }).catch(error => { console.log(error) })
                }
                break
            case "editActivity":
                let validateEditActivity = objectUtil.formValidate(formDataActivity)
                if (validateEditActivity) {
                    setShowModalForm(false)
                    dispatch(modalLoadingAction.show())

                    editActivity(formDataActivity).then(({ data }) => {
                        let { success } = data
                        if (success) {
                            getDetail(true, false)
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
        let { id, value } = target
        formDataActivity[id] = value

        switch (modeModalForm) {
            case "editContact":
                formDataContact[id] = value
                break
            case "editActivity":
                formDataActivity[id] = value
                break
            default:
                break
        }
        switch (id) {
            case "activityTypeId":
                if (value === 6 || value === 8) {
                    setIsActivityAboutSaraly(true)
                    formDataActivity.salary = ""
                } else {
                    setIsActivityAboutSaraly(false)
                    delete formDataActivity.salary
                }
                break
            default:
                break
        }
    }

    let handleSelectTabs = (key) => {
        if (key === "activity")
            setIsTabActivity(true)
        else
            setIsTabActivity(false)
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
                            <>
                                <Tabs defaultActiveKey="activity" onSelect={(key) => handleSelectTabs(key)}>
                                    <Tab eventKey="activity" title="Activity">
                                        <RowActivity data={activity} isOrder={true} onClickEdit={handleClickEditActivity} onClickDelete={handleClickDeleteActivity} />
                                    </Tab>
                                    <Tab eventKey="candidate" title="Candidate">
                                        <Tables
                                            columnLabel={["Full Name", "Email", "Phone", "Appropriate"]}
                                            column={["fullName", "email", "phoneNumber", "matching"]}
                                            row={candidateList}
                                            onClickRow={handleClickRow}
                                            pathCreate={"/candidate/create"} />
                                    </Tab>
                                </Tabs>
                                <button className={"outline-primary"} onClick={handleClickCreateActivity} style={{ width: 40, height: 40, position: "absolute", top: 63, right: 15, display: `${isTabActivity ? "block" : "none"}` }}>
                                    <i className="fa fa-plus" />
                                </button>
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
                        {(modeModalForm === "editActivity" || modeModalForm === "createActivity") &&
                            <Row>
                                <InputSelect xs={12} sm={12} lg={12} label={"Type"} id={"activityTypeId"} optionsList={generalConstant.activityTypeAboutOrderList} onChange={handleChangeInput} defaultValue={formDataActivity.activityTypeId} isSearchable={true} isDisabled={modeModalForm === "editActivity"} />
                                <InputSelect xs={12} sm={12} lg={12} label={"Candidate"} id={"candidateId"} optionsList={candidateListForSelect} onChange={handleChangeInput} defaultValue={formDataActivity.candidateId} isSearchable={true} isDisabled={(modeModalForm === "editActivity")} />

                                {isActivityAboutSaraly &&
                                    <Input xs={12} sm={12} lg={12} label={"Salary"} id={"salary"} type={"number"} unit={"Baht"} onChange={handleChangeInput} defaultValue={formDataActivity.salary} />
                                }
                                <Input xs={12} sm={12} lg={12} label={"Note"} id={"activityNote"} type={"textarea"} onChange={handleChangeInput} defaultValue={formDataActivity.activityNote} />
                                <Input id={"id"} isHidden={true} defaultValue={formDataActivity.id} />
                                <Input id={"candidateId"} isHidden={true} defaultValue={formDataActivity.candidateId} />
                            </Row>
                        }
                    </>
                } />
        </>
    )
}

export default OrderDetail