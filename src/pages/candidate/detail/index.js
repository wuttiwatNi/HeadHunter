import React, { useState, useEffect, useCallback } from "react"
import { useHistory, useParams } from "react-router-dom"
import { objectUtil } from "../../../utils/object.util"
import { useDispatch } from "react-redux"
import { format, differenceInYears, differenceInMonths } from "date-fns"
// api
import { candidateApi, activityApi } from "../../../api"
// action
import { modalErrorAction } from "../../../actions"
import { modalLoadingAction } from "../../../actions"
// components
import { Topic, Box, ModalNormal, /*ModalForm, Input, InputSelect,*/ Information, RowSkill, RowEducation, RowLanguageSkill, RowWorking } from "../../../components"
import { Row, Col, Spinner } from "react-bootstrap"

function CandidateDetail() {
    const history = useHistory()
    const { id } = useParams()

    const dispatch = useDispatch()
    const [isLoadData, setIsLoadData] = useState(true)

    const { getCandidate, deleteCandidate } = candidateApi
    const { getActivityByCandidateId } = activityApi

    // const [showModalForm, setShowModalForm] = useState(false)
    // const [titleModalForm, setTitleModalForm] = useState("")
    // const [subTitleModalForm, setSubTitleModalForm] = useState("")
    // const [modeModalForm, setModeModalForm] = useState("")

    const [showModalNormal, setShowModalNormal] = useState(false)
    const [titleModalNormal, setTitleModalNormal] = useState("")
    const [desModalNormal, setDesModalNormal] = useState("")
    const [swapColorModalNormal, setSwapColorModalNormal] = useState(false)
    const [modeModalNormal, setModeModalNormal] = useState("")

    const [candidate, setCandidate] = useState()
    const [education, setEducation] = useState([])
    const [skill, setSkill] = useState([])
    const [languageSkill, setLanguageSkill] = useState([])
    const [working, setWorking] = useState([])

    let _getCandidate = useCallback(() => {
        return new Promise(function (resolve, reject) {
            getCandidate(id).then(({ data }) => {
                let { success, result } = data
                if (success && result.length !== 0) {
                    setCandidate({
                        ...result[0],
                        fullName: `${result[0]["firstName"]} ${result[0]["lastName"]}`,
                        _nidType: objectUtil.mapNidTypeList(result[0]["nidType"]),
                        _gendar: objectUtil.mapGendarList(result[0]["gendar"]),
                        _maritalStatus: objectUtil.mapMaritalList(result[0]["maritalStatus"]),
                        _drivingLicense: result[0]["drivingLicense"] === 1 ? "Yes" : "No",
                        _ownCar: result[0]["ownCar"] === 1 ? "Yes" : "No",
                        _dateOfBirth: `${format(new Date(result[0].dateOfBirth), "dd-MM-yyyy")} (${differenceInYears(Date.now(), new Date(result[0].dateOfBirth))} age)`,
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
                            calYearWorking: `${year > 0 ? `${year} Year ` : ""}${month > 0 ? `${month} Month` : ""}`,
                            _startDate: format(new Date(element.startDate), "dd-MM-yyyy"),
                            _endDate: format(new Date(element.endDate), "dd-MM-yyyy")
                        }
                    })
                    setEducation(objectUtil.sortArray(education, "levelType"))
                    setSkill(result[0].skill)
                    setLanguageSkill(objectUtil.mapDataLanguage(result[0].languageSkill))
                    setWorking(working)
                    resolve()
                } else {
                    reject()
                }
            }).catch(error => { console.log(error) })
        })
    }, [getCandidate, id])

    let _getActivityByCandidateId = useCallback(() => {
        return new Promise(function (resolve, reject) {
            getActivityByCandidateId(id).then(({ data }) => {
                let { success, result } = data
                if (success) {
                    console.log(result)
                    resolve()
                } else {
                    reject()
                }
            }).catch(error => { console.log(error) })
        })
    }, [getActivityByCandidateId, id])

    let getDetail = useCallback((isRefresh) => {
        Promise.all([_getCandidate(), _getActivityByCandidateId()]).then((result) => {
            setIsLoadData(false)
        }).catch(() => {
            dispatch(modalErrorAction.show())
        }).finally(() => {
            if (isRefresh) {
                dispatch(modalLoadingAction.close())
            }
        })
    }, [_getCandidate, _getActivityByCandidateId, dispatch])

    useEffect(() => {
        getDetail(false)
    }, [getDetail])

    let handleClickEditCandidate = () => {
        history.push(`/candidate/edit/${id}`)
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
                        history.replace("/candidate")
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

    // let handleOkModalsForm = () => {
    //     switch (modeModalForm) {
    //         default:
    //             break
    //     }
    // }

    // let handleChangeInput = ({ target }) => {
    //     switch (modeModalForm) {
    //         case "addSkill":
    //             formDataSkill[target.id] = target.value
    //             break
    //         case "addLanguageSkill":
    //             formDataLanguageSkill[target.id] = target.value
    //             break
    //         case "editContact":
    //             formDataContact[target.id] = target.value
    //             break
    //         default:
    //             break
    //     }
    // }

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
                                                { label: "Category (1st)", key: "positionFristCategoryName" },
                                                { label: "Position (1st)", key: "positionAppliedFristName" },
                                                { label: "Category (2nd) ", key: "positionSecondCategoryName" },
                                                { label: "Position (2nd)", key: "positionAppliedSecondName" },
                                                { label: "Nickname", key: "nickname" },
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
                                                { label: "Gendar", key: "_gendar" },
                                                { label: "Marital Status", key: "_maritalStatus" },
                                                { label: "Date Of Birth", key: "_dateOfBirth" },
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
                        <Box xs={12} sm={12} lg={6} body={() => (
                            <>

                            </>
                        )} />
                    </Row>
                </>)}
            <ModalNormal title={titleModalNormal} description={desModalNormal} show={showModalNormal} swapColor={swapColorModalNormal}
                handleClose={() => setShowModalNormal(false)} handleOk={handleOkModals} />
            {/* <ModalForm title={titleModalForm} subTitle={subTitleModalForm} show={showModalForm}
                handleClose={() => setShowModalForm(false)} handleOk={handleOkModalsForm}
                form={() =>
                    <>
                    </>
                } /> */}
        </>
    )
}

export default CandidateDetail
