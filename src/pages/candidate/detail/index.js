import React, { useState, useEffect, useCallback } from "react"
import { useHistory, useParams } from "react-router-dom"
import { objectUtil } from "../../../utils/object.util"
import { useDispatch } from "react-redux"
import { format, differenceInYears, differenceInMonths } from "date-fns"
import { store } from "react-notifications-component"
// constants
import { generalConstant, toatConstant } from "../../../constants/index"
// api
import { candidateApi, activityApi, customerApi, orderApi } from "../../../api"
// action
import { modalErrorAction } from "../../../actions"
import { modalLoadingAction } from "../../../actions"
// components
import { Topic, Box, ModalNormal, ModalForm, Input, InputSelect, Information, RowSkill, RowEducation, RowLanguageSkill, RowWorking, RowActivity } from "../../../components"
import { Row, Col, Spinner } from "react-bootstrap"

function CandidateDetail() {
    const history = useHistory()
    const { id } = useParams()

    const dispatch = useDispatch()
    const [isLoadData, setIsLoadData] = useState(true)

    const { getCandidate, deleteCandidate } = candidateApi
    const { getCustomerList } = customerApi
    const { getOrderByCustomerId } = orderApi
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
        activityTypeId: "",
        activityNote: ""
    })
    const [isActivityAboutOrder, setIsActivityAboutOrder] = useState(false)
    const [isActivityAboutSaraly, setIsActivityAboutSaraly] = useState(false)

    const [candidate, setCandidate] = useState()
    const [education, setEducation] = useState([])
    const [skill, setSkill] = useState([])
    const [languageSkill, setLanguageSkill] = useState([])
    const [working, setWorking] = useState([])
    const [activity, setActivity] = useState([])

    const [customerList, setCustomerList] = useState([])
    const [orderList, setOrderList] = useState([])

    let _getCandidate = useCallback((isRefresh, isDelete) => {
        getCandidate(id).then(({ data }) => {
            let { success, result } = data
            if (success && result.length !== 0) {
                setCandidate({
                    ...result[0],
                    fullName: `${result[0]["firstName"]} ${result[0]["lastName"]}`,
                    _nidType: objectUtil.mapNidTypeList(result[0]["nidType"]),
                    _drivingLicense: result[0]["drivingLicense"] === 1 ? "Yes" : "No",
                    _ownCar: result[0]["ownCar"] === 1 ? "Yes" : "No",
                    _dateOfBirth: `${format(new Date(result[0].dateOfBirth), "dd-MM-yyyy")}`,
                    age: `${differenceInYears(Date.now(), new Date(result[0].dateOfBirth))} age`,
                    _salaryExpect: `${result[0].salaryExpect.toLocaleString()} ฿`,
                    _height: `${result[0].height} CM`
                })
                let education = result[0].education.map(element => ({
                    ...element,
                    _levelType: objectUtil.mapLevelEducationList(element.levelType),
                    _graduate: format(new Date(element.graduate), "dd-MM-yyyy")
                }))
                let working = result[0].working.map(element => {
                    let year = differenceInYears(new Date(element.endDate), new Date(element.startDate))
                    let month = differenceInMonths(new Date(element.endDate), new Date(element.startDate))
                    while (month >= 12) {
                        month = month - 12
                    }
                    return {
                        ...element,
                        _salary: element.salary.toLocaleString(),
                        calBonus: (element.salary * element.bonus).toLocaleString(),
                        calYearWorking: `${year > 0 ? `${year} Year` : ""}${(year > 0 && month > 0) ? " " : ""}${month > 0 ? `${month} Month` : ""}`,
                        _startDate: format(new Date(element.startDate), "dd-MM-yyyy"),
                        _endDate: format(new Date(element.endDate), "dd-MM-yyyy")
                    }
                })
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

                setEducation(objectUtil.sortArray(education, "levelType"))
                setSkill(result[0].skill)
                setLanguageSkill(objectUtil.mapDataLanguage(result[0].languageSkill))
                setWorking(working)
                setActivity(activity)

                setIsLoadData(false)
            } else {
                dispatch(modalErrorAction.goBack())
                dispatch(modalErrorAction.setDes("Not found candidate. Please try again later."))
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
    }, [getCandidate, id, dispatch])

    useEffect(() => {
        _getCandidate(false, false)
    }, [_getCandidate])

    let handleClickEditCandidate = () => {
        history.push(`/candidate/edit/${id}`)
    }

    let handleClickCreateActivity = () => {
        dispatch(modalLoadingAction.show())
        setIsActivityAboutOrder(false)
        setIsActivityAboutSaraly(false)

        delete formDataActivity.customerId
        delete formDataActivity.orderId
        delete formDataActivity.salary

        getCustomerList().then(({ data }) => {
            let { success, result } = data
            if (success) {
                setCustomerList(objectUtil.sortArray(objectUtil.formForInputSelect(result, "id", "companyName"), "label"))
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
        formDataActivity.activityTypeId = data.activityTypeId
        formDataActivity.activityNote = data.activityNote

        setIsActivityAboutOrder(false)
        setIsActivityAboutSaraly(false)

        delete formDataActivity.customerId
        delete formDataActivity.orderId
        delete formDataActivity.salary

        if (data.activityTypeId >= 1 && data.activityTypeId <= 4) {
            setTitleModalForm("Activity")
            setSubTitleModalForm("edit")
            setModeModalForm("editActivity")
            setShowModalForm(true)
        }
        else if (data.activityTypeId >= 5 && data.activityTypeId <= 9) {
            setIsActivityAboutOrder(true)
            formDataActivity.customerId = data.customerId
            formDataActivity.orderId = data.orderId
            if (data.activityTypeId === 6 || data.activityTypeId === 8) {
                setIsActivityAboutSaraly(true)
                formDataActivity.salary = data.salary
            }

            dispatch(modalLoadingAction.show())

            let _getCustomerList = new Promise((resolve, reject) => {
                getCustomerList().then(({ data }) => {
                    let { success, result } = data
                    if (success) {
                        setCustomerList(objectUtil.sortArray(objectUtil.formForInputSelect(result, "id", "companyName"), "label"))
                        resolve()
                    } else {
                        dispatch(modalErrorAction.show())
                    }
                }).catch(error => { console.log(error) })
            })

            Promise.all([_getCustomerList, _getOrderByCustomerId(formDataActivity.customerId)]).then((result) => {
                setTitleModalForm("Activity")
                setSubTitleModalForm("edit")
                setModeModalForm("editActivity")
                setShowModalForm(true)
            }).catch(() => { dispatch(modalErrorAction.show()) }).finally(() => {
                dispatch(modalLoadingAction.close())
            })
        }
    }

    let handleClickDeleteActivity = (data) => {
        setTitleModalNormal("Delete Activity!")
        setDesModalNormal(`Are you sure to delete (${objectUtil.mapActivityTypeId(data.activityTypeId)} ${data.createdDate}:${data.createdTime})?`)
        setSwapColorModalNormal(true)
        setModeModalNormal("deleteActivity")
        setIdDelete(data.id)
        setShowModalNormal(true)
    }

    let handleClickDeleteCandidate = () => {
        setTitleModalNormal("Delete Candidate!")
        setDesModalNormal(`Are you sure to delete (${candidate["fullName"]})?`)
        setSwapColorModalNormal(true)
        setModeModalNormal("deleteCandidate")
        setShowModalNormal(true)
    }

    let handleOkModals = () => {
        switch (modeModalNormal) {
            case "deleteCandidate":
                setShowModalNormal(false)
                dispatch(modalLoadingAction.show())

                deleteCandidate(id).then(({ data }) => {
                    let { success } = data
                    if (success) {
                        store.addNotification(toatConstant.deleteDataSuccess())
                        history.replace("/candidate")
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
                        _getCandidate(true, true)
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
        let validate = false
        switch (modeModalForm) {
            case "createActivity":
                formDataActivity.id = "-"
                formDataActivity.candidateId = id
                validate = objectUtil.formValidate(formDataActivity)
                if (validate) {
                    setShowModalForm(false)
                    dispatch(modalLoadingAction.show())

                    createActivity(formDataActivity).then(({ data }) => {
                        let { success } = data
                        if (success) {
                            _getCandidate(true, false)
                        } else {
                            dispatch(modalErrorAction.show())
                        }
                    }).catch(error => { console.log(error) }).finally(() => {
                        dispatch(modalLoadingAction.close())
                    })
                }
                break
            case "editActivity":
                validate = objectUtil.formValidate(formDataActivity)
                if (validate) {
                    setShowModalForm(false)
                    dispatch(modalLoadingAction.show())

                    editActivity(formDataActivity).then(({ data }) => {
                        let { success } = data
                        if (success) {
                            _getCandidate(true, false)
                        } else {
                            dispatch(modalErrorAction.show())
                        }
                    }).catch(error => { console.log(error) }).finally(() => {
                        dispatch(modalLoadingAction.close())
                    })
                }
                break
            default:
                break
        }
    }

    let handleChangeInput = ({ target }) => {
        let { id, value } = target
        formDataActivity[id] = value

        switch (id) {
            case "activityTypeId":
                if (value > 4 && value < 10) {
                    setIsActivityAboutOrder(true)
                    formDataActivity.customerId = ""
                    formDataActivity.orderId = ""
                } else {
                    setIsActivityAboutOrder(false)
                    delete formDataActivity.customerId
                    delete formDataActivity.orderId
                }
                if (value === 6 || value === 8) {
                    setIsActivityAboutSaraly(true)
                    formDataActivity.salary = ""
                } else {
                    setIsActivityAboutSaraly(false)
                    delete formDataActivity.salary
                }
                break
            case "customerId":
                if (value) {
                    clearSelect(["orderId"])
                    _getOrderByCustomerId(value)
                }
                break
            default:
                break
        }
    }

    let _getOrderByCustomerId = (id) => {
        return new Promise((resolve, reject) => {
            getOrderByCustomerId(id).then(({ data }) => {
                let { success, result } = data
                if (success) {
                    setOrderList(objectUtil.sortArray(objectUtil.formForInputSelect(result, "id", "positionName"), "label"))
                    resolve()
                } else {
                    dispatch(modalErrorAction.show())
                }
            }).catch(error => { console.log(error) })
        })
    }

    let clearSelect = (arrayId) => {
        arrayId.forEach(id => {
            formDataActivity[id] = ""
            document.getElementById(`clear-select-${id}`).click()
        })
    }

    return (
        <>
            {isLoadData ? (
                <div className={"spinner"}>
                    <Spinner animation="grow" variant="primary" />
                </div>) :
                (<>
                    <Topic title={candidate["fullName"]} subTitle={"candidate"} onClickDelete={handleClickDeleteCandidate} />
                    <Row>
                        <Col xs={12} sm={12} lg={6} className={"no-padding"}>
                            <Row>
                                <Box title={"Information"} icon={"fa-pencil"} onClickIcon={handleClickEditCandidate} xs={12} sm={12} lg={12}
                                    body={() => (
                                        <Information data={candidate}
                                            keyValue={[
                                                { label: "", key: "picturePath", full: true, img: true },
                                                { label: "Resume", key: "resumePath", pdf: true },
                                                { label: "Nickname", key: "nickname" },
                                                { label: "Category (1st)", key: "positionFirstCategoryName" },
                                                { label: "Position (1st)", key: "positionAppliedFirstName" },
                                                { label: "Category (2nd) ", key: "positionSecondCategoryName" },
                                                { label: "Position (2nd)", key: "positionAppliedSecondName" },
                                                { label: "Nationality", key: "nationalityName" },
                                                { label: "NidType", key: "_nidType" },
                                                { label: "Nid Number", key: "nidNumber" },
                                                { label: "Salary Expect", key: "_salaryExpect" },
                                                { label: "Address", key: "address" },
                                                { label: "Province", key: "provinceName" },
                                                { label: "Amphure", key: "amphureName" },
                                                { label: "District", key: "districtName" },
                                                { label: "ZipCode", key: "zipCode" },
                                                { label: "Phone", key: "phoneNumber" },
                                                { label: "Email", key: "email" },
                                                { label: "Gendar", key: "gendar" },
                                                { label: "Date Of Birth", key: "_dateOfBirth" },
                                                { label: "Age", key: "age" },
                                                { label: "Marital Status", key: "maritalStatus" },
                                                { label: "Height", key: "_height" },
                                                { label: "Driving License", key: "_drivingLicense" },
                                                { label: "OwnCar", key: "_ownCar" },
                                                { label: "Comment", key: "comment", full: true }
                                            ]}
                                        />
                                    )} />
                                <Box title={"Education"} xs={12} sm={12} lg={12}
                                    body={() => (
                                        <RowEducation data={education} />
                                    )} />
                                <Box title={"Skill"} xs={12} sm={12} lg={12}
                                    body={() => (
                                        <RowSkill data={skill} />
                                    )} />
                                <Box title={"Language"} xs={12} sm={12} lg={12}
                                    body={() => (
                                        <RowLanguageSkill data={languageSkill} />
                                    )} />
                                <Box title={"Working"} xs={12} sm={12} lg={12}
                                    body={() => (
                                        <RowWorking data={working} />
                                    )} />
                            </Row>
                        </Col>
                        <Box title={"Activity"} icon={"fa-plus"} onClickIcon={handleClickCreateActivity} xs={12} sm={12} lg={6} body={() => (
                            <RowActivity data={activity} onClickEdit={handleClickEditActivity} onClickDelete={handleClickDeleteActivity} />
                        )} />
                    </Row>
                </>)}
            <ModalNormal title={titleModalNormal} description={desModalNormal} show={showModalNormal} swapColor={swapColorModalNormal}
                handleClose={() => setShowModalNormal(false)} handleOk={handleOkModals} />
            <ModalForm title={titleModalForm} subTitle={subTitleModalForm} show={showModalForm}
                handleClose={() => setShowModalForm(false)} handleOk={handleOkModalsForm}
                form={() =>
                    <Row>
                        <InputSelect xs={12} sm={12} lg={12} label={"Type"} id={"activityTypeId"} optionsList={generalConstant.activityTypeList} onChange={handleChangeInput} defaultValue={formDataActivity.activityTypeId} isSearchable={true} isDisabled={modeModalForm === "editActivity"} />
                        {isActivityAboutOrder &&
                            <>
                                <InputSelect xs={12} sm={12} lg={12} label={"Company"} id={"customerId"} optionsList={customerList} onChange={handleChangeInput} defaultValue={formDataActivity.customerId} isSearchable={true} isDisabled={modeModalForm === "editActivity"} />
                                <InputSelect xs={12} sm={12} lg={12} label={"Order"} id={"orderId"} optionsList={orderList} onChange={handleChangeInput} defaultValue={formDataActivity.orderId} isSearchable={true} isDisabled={modeModalForm === "editActivity"} />
                            </>
                        }
                        {isActivityAboutSaraly &&
                            <Input xs={12} sm={12} lg={12} label={"Salary"} id={"salary"} type={"number"} unit={"Baht"} onChange={handleChangeInput} defaultValue={formDataActivity.salary} />
                        }
                        <Input xs={12} sm={12} lg={12} label={"Note"} id={"activityNote"} type={"textarea"} onChange={handleChangeInput} defaultValue={formDataActivity.activityNote} />
                        <Input id={"id"} isHidden={true} defaultValue={formDataActivity.id} />
                        <Input id={"candidateId"} isHidden={true} defaultValue={formDataActivity.candidateId} />
                    </Row>
                } />
        </>
    )
}

export default CandidateDetail
