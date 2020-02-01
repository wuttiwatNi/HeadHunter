import React, { useState, useEffect, useCallback } from "react"
import { useHistory, useParams } from "react-router-dom"
import { useDispatch } from "react-redux"
import { objectUtil } from "../../../utils/object.util"
import { store } from "react-notifications-component"
import { format } from "date-fns"
// constants
import { generalConstant, toatConstant } from "../../../constants/index"
// api
import { positionApi, skillApi, languageSkillApi, candidateApi, nationalityApi, masterApi } from "../../../api"
// action
import { modalErrorAction } from "../../../actions"
import { modalLoadingAction } from "../../../actions"
// components
import { Topic, Box, Input, InputSelect, ModalNormal, CreateSkill, CreateLanguageSkill, CreateEducation, CreateWorking } from "../../../components"
import { Row, Col, Spinner } from "react-bootstrap"

function CandidateCreate({ mode }) {
    const history = useHistory()
    const dispatch = useDispatch()
    const { id } = useParams()

    const [isReset, setIsReset] = useState(false)
    const [isLoadData, setIsLoadData] = useState(true)

    const [showModalNormal, setShowModalNormal] = useState(false)
    const [titleModalNormal, setTitleModalNormal] = useState("")
    const [desModalNormal, setDesModalNormal] = useState("")
    const [swapColorModalNormal, setSwapColorModalNormal] = useState(false)
    const [modeModalNormal, setModeModalNormal] = useState("")

    const { getCategoryList, getPositionListByCategoryId } = positionApi
    const { getSkillList } = skillApi
    const { getLanguageSkillList } = languageSkillApi
    const { getCandidate, createCandidate, editCandidate } = candidateApi
    const { getProvinceList, getAmphureListByProvinceId, getDistrictListByAmphureId } = masterApi
    const { getNationalityList } = nationalityApi

    const [currentCandidate, setCurrentCandidate] = useState({})
    const [formDataCandidate] = useState({
        categoryIdFrist: "",
        positionAppliedFirst: "",
        categoryIdSecond: "",
        positionAppliedSecond: "",
        firstName: "",
        lastName: "",
        nationalityId: "",
        nidType: "",
        nidNumber: "",
        nickname: "",
        salaryExpect: "",
        address: "",
        provinceId: "",
        amphureId: "",
        districtId: "",
        phoneNumber: "",
        email: "",
        gendar: "",
        maritalStatus: "",
        dateOfBirth: "",
        height: "",
        drivingLicense: false,
        ownCar: false,
        comment: "",
        resume: {},
        picture: {},
        skill: [],
        languageSkill: [],
        education: [],
        working: []
    })
    const [formDataEdcution, setFormDataEdcution] = useState([])
    const [formDataSkill, setFormDataSkill] = useState([])
    const [formDataLanguageSkill, setFormDataLanguageSkill] = useState([])
    const [formDataWorking, setFormDataWorking] = useState([])

    const [categoryList, setCategoryList] = useState([])
    const [positionList1, setPositionList1] = useState([])
    const [positionList2, setPositionList2] = useState([])
    const [proviceList, setProviceList] = useState([])
    const [amphurList, setAmphureList] = useState([])
    const [districtList, setDistrictList] = useState([])
    const [skillList, setSkillList] = useState([])
    const [languageSkillList, setLanguageSkillList] = useState([])
    const [nationalityList, setNationalityList] = useState([])
    const [defaultPositionList, setDefaultPositionList] = useState([])

    let _getPositionListByCategoryId = useCallback((categoryId, number) => {
        return new Promise(function (resolve, reject) {
            getPositionListByCategoryId(categoryId).then(({ data }) => {
                let { success, result } = data
                if (success) {
                    if (number === 1) {
                        setPositionList1(objectUtil.sortArray(objectUtil.formForInputSelect(result, "id", "name"), "label"))
                    } else if (number === 2) {
                        setPositionList2(objectUtil.sortArray(objectUtil.formForInputSelect(result, "id", "name"), "label"))
                    }
                    resolve()
                } else {
                    dispatch(modalErrorAction.show())
                }
            }).catch(error => { console.log(error) })
        })
    }, [getPositionListByCategoryId, dispatch])

    let _getAmphureListByProvinceId = useCallback((provinceId) => {
        return new Promise(function (resolve, reject) {
            getAmphureListByProvinceId(provinceId).then(({ data }) => {
                let { success, result } = data
                if (success) {
                    setAmphureList(objectUtil.formForInputSelect(result, "id", "nameTH"))
                    resolve()
                } else {
                    dispatch(modalErrorAction.show())
                }
            }).catch(error => { console.log(error) })
        })
    }, [getAmphureListByProvinceId, dispatch])

    let _getDistrictListByAmphureId = useCallback((amphureId) => {
        return new Promise(function (resolve, reject) {
            getDistrictListByAmphureId(amphureId).then(({ data }) => {
                let { success, result } = data
                if (success) {
                    setDistrictList(objectUtil.formForInputSelect(result, "id", "nameTH"))
                    resolve()
                } else {
                    dispatch(modalErrorAction.show())
                }
            }).catch(error => { console.log(error) })
        })
    }, [getDistrictListByAmphureId, dispatch])

    useEffect(() => {
        var promise1 = new Promise(function (resolve, reject) {
            getCategoryList().then(({ data }) => {
                let { success, result } = data
                if (success) {
                    setCategoryList(objectUtil.sortArray(objectUtil.formForInputSelect(result, "id", "name"), "label"))
                    resolve()
                } else {
                    dispatch(modalErrorAction.show())
                }
            }).catch(error => { console.log(error) })
        })

        var promise2 = new Promise(function (resolve, reject) {
            getProvinceList().then(({ data }) => {
                let { success, result } = data
                if (success) {
                    setProviceList(objectUtil.formForInputSelect(result, "id", "nameTH"))
                    resolve()
                } else {
                    dispatch(modalErrorAction.show())
                }
            }).catch(error => { console.log(error) })
        })

        var promise3 = new Promise(function (resolve, reject) {
            getSkillList().then(({ data }) => {
                let { success, result } = data
                if (success) {
                    setSkillList(objectUtil.sortArray(objectUtil.formForInputSelect(result, "id", "name"), "label"))
                    resolve(objectUtil.sortArray(objectUtil.formForInputSelect(result, "id", "name"), "label"))
                } else {
                    dispatch(modalErrorAction.show())
                }
            }).catch(error => { console.log(error) })
        })

        var promise4 = new Promise(function (resolve, reject) {
            getLanguageSkillList().then(({ data }) => {
                let { success, result } = data
                if (success) {
                    setLanguageSkillList(objectUtil.sortArray(objectUtil.formForInputSelect(result, "id", "name"), "label"))
                    resolve(objectUtil.sortArray(objectUtil.formForInputSelect(result, "id", "name"), "label"))
                } else {
                    dispatch(modalErrorAction.show())
                }
            }).catch(error => { console.log(error) })
        })

        var promise5 = new Promise(function (resolve, reject) {
            getNationalityList().then(({ data }) => {
                let { success, result } = data
                if (success) {
                    setNationalityList(objectUtil.sortArray(objectUtil.formForInputSelect(result, "id", "name"), "label"))
                    resolve()
                } else {
                    dispatch(modalErrorAction.show())
                }
            }).catch(error => { console.log(error) })
        })

        if (mode === "create") {
            Promise.all([promise1, promise2, promise3, promise4, promise5]).then(() => {
                setIsLoadData(false)
            })
        } else {
            getCandidate(id).then(({ data }) => {
                let { success, result } = data
                if (success && result.length !== 0) {
                    let {
                        id,
                        positionFirstCategoryId,
                        positionSecondCategoryId,
                        positionAppliedFirst,
                        positionAppliedSecond,
                        firstName,
                        lastName,
                        nickname,
                        nationalityId,
                        nidType,
                        nidNumber,
                        dateOfBirth,
                        gendar,
                        maritalStatus,
                        height,
                        email,
                        phoneNumber,
                        salaryExpect,
                        drivingLicense,
                        ownCar,
                        address,
                        provinceId,
                        amphureId,
                        districtId,
                        comment,
                        picturePath,
                        resumePath,
                        education,
                        working,
                        skill,
                        languageSkill
                    } = result[0]

                    formDataCandidate.id = id
                    formDataCandidate.categoryIdFrist = positionFirstCategoryId
                    formDataCandidate.categoryIdSecond = positionSecondCategoryId
                    formDataCandidate.positionAppliedFirst = positionAppliedFirst
                    formDataCandidate.positionAppliedSecond = positionAppliedSecond
                    formDataCandidate.firstName = firstName
                    formDataCandidate.lastName = lastName
                    formDataCandidate.nickname = nickname
                    formDataCandidate.nationalityId = nationalityId
                    formDataCandidate.nidType = nidType
                    formDataCandidate.nidNumber = nidNumber
                    formDataCandidate.dateOfBirth = format(new Date(dateOfBirth), "yyyy-MM-dd").toString()
                    formDataCandidate.gendar = gendar
                    formDataCandidate.maritalStatus = maritalStatus
                    formDataCandidate.height = height
                    formDataCandidate.email = email
                    formDataCandidate.phoneNumber = phoneNumber
                    formDataCandidate.salaryExpect = salaryExpect
                    formDataCandidate.drivingLicense = drivingLicense ? true : false
                    formDataCandidate.ownCar = ownCar ? true : false
                    formDataCandidate.address = address
                    formDataCandidate.provinceId = provinceId
                    formDataCandidate.amphureId = amphureId
                    formDataCandidate.districtId = districtId
                    formDataCandidate.comment = comment

                    // Get name and surname picture
                    let __picturePath = picturePath.split("/")
                    let namePicture = __picturePath[__picturePath.length - 1]
                    formDataCandidate.namePicture = namePicture

                    // Get name and surname resume
                    if (resumePath === null)
                        resumePath = ""
                    let __resumePath = resumePath.split("/")
                    let nameResume = __resumePath[__resumePath.length - 1]
                    formDataCandidate.nameResume = nameResume

                    education = education.map((element) => ({
                        ...element,
                        graduate: format(new Date(element.graduate), "yyyy-MM-dd").toString()
                    }))

                    working = working.map((element) => ({
                        ...element,
                        startDate: format(new Date(element.startDate), "yyyy-MM-dd").toString(),
                        endDate: format(new Date(element.endDate), "yyyy-MM-dd").toString()
                    }))

                    setFormDataEdcution(JSON.parse(JSON.stringify(education)))
                    setFormDataSkill(JSON.parse(JSON.stringify(skill)))
                    setFormDataLanguageSkill(JSON.parse(JSON.stringify(languageSkill)))
                    setFormDataWorking(JSON.parse(JSON.stringify(working)))

                    var promiseSet1 = _getPositionListByCategoryId(positionFirstCategoryId, 1)
                    var promiseSet2 = _getPositionListByCategoryId(positionSecondCategoryId, 2)
                    var promiseSet3 = _getAmphureListByProvinceId(provinceId)
                    var promiseSet4 = _getDistrictListByAmphureId(amphureId)

                    Promise.all([promise1, promise2, promise3, promise4, promiseSet1, promiseSet2, promiseSet3, promiseSet4]).then((result) => {
                        // Filter skill list
                        let _skillList = result[2].filter(element => {
                            let result = true
                            skill.forEach(_element => {
                                if (element.value === _element.skillId) {
                                    result = false
                                }
                            })
                            return result
                        })
                        // Filter language skill list
                        let _languageSkillList = result[3].filter(element => {
                            let result = true
                            languageSkill.forEach(_element => {
                                if (element.value === _element.languageSkillId) {
                                    result = false
                                }
                            })
                            return result
                        })
                        setSkillList(_skillList)
                        setLanguageSkillList(_languageSkillList)
                        setIsLoadData(false)
                        setCurrentCandidate({
                            ...formDataCandidate,
                            education: JSON.parse(JSON.stringify(education)),
                            skill: JSON.parse(JSON.stringify(skill)),
                            languageSkill: JSON.parse(JSON.stringify(languageSkill)),
                            working: JSON.parse(JSON.stringify(working)),
                            skillList: JSON.parse(JSON.stringify(_skillList)),
                            languageSkillList: JSON.parse(JSON.stringify(_languageSkillList))
                        })
                    })
                } else {
                    dispatch(modalErrorAction.goBack())
                    dispatch(modalErrorAction.setDes("Not found candidate. Please try again later."))
                    dispatch(modalErrorAction.show())
                }
            }).catch(error => { console.log(error) })
        }
    }, [getCategoryList, getSkillList, getLanguageSkillList, dispatch, _getPositionListByCategoryId, _getAmphureListByProvinceId, _getDistrictListByAmphureId, formDataCandidate, getCandidate, getProvinceList, getNationalityList, id, mode])

    let handleChangeInput = ({ target }) => {
        let { id, value } = target

        if (target.type === "file") {
            if (target.files.length !== 0) {
                let typeFileAccept = target.accept.toString().split(",")
                let typeFile = "." + target.files[0].type.toString().split("/")[1]
                if (typeFileAccept.indexOf(typeFile) !== -1) {
                    formDataCandidate[id] = target.files[0]
                } else {
                    formDataCandidate[id] = {}
                }
            } else {
                formDataCandidate[id] = {}
            }
        } else if (target.type === "checkbox") {
            formDataCandidate[id] = target.checked
        } else {
            formDataCandidate[id] = value
        }

        switch (id) {
            case "categoryIdFrist":
                if (value) {
                    clearSelect(["positionAppliedFirst"])
                    _getPositionListByCategoryId(value, 1)
                }
                break
            case "categoryIdSecond":
                if (value) {
                    clearSelect(["positionAppliedSecond"])
                    _getPositionListByCategoryId(value, 2)
                }
                break
            case "provinceId":
                if (value) {
                    clearSelect(["amphureId", "districtId"])
                    _getAmphureListByProvinceId(value)
                }
                break
            case "amphureId":
                if (value) {
                    clearSelect(["districtId"])
                    _getDistrictListByAmphureId(value)
                }
                break
            default:
                break
        }
    }

    let clearSelect = (arrayId) => {
        arrayId.forEach(id => {
            formDataCandidate[id] = ""
            document.getElementById(`clear-select-${id}`).click()
        })
    }

    let handleCreate = () => {
        let validate5 = objectUtil.formValidateItem(formDataWorking, "id")
        let validate4 = objectUtil.formValidateItem(formDataEdcution, "id")
        let validate3 = objectUtil.formValidateItem(formDataLanguageSkill, "languageSkillId")
        let validate2 = objectUtil.formValidateItem(formDataSkill, "skillId")
        let validate1 = objectUtil.formValidate(formDataCandidate)

        if (validate1 && validate2 && validate3 && validate4 && validate5) {
            setTitleModalNormal(`${mode === "create" ? "Create" : "Edit"}!`)
            setDesModalNormal(`Are you sure to ${mode === "create" ? "Create" : "Edit"}?`)
            setSwapColorModalNormal(false)
            setModeModalNormal(mode)
            setShowModalNormal(true)
        }
    }

    let handleReset = () => {
        var promise1 = _getPositionListByCategoryId(currentCandidate.categoryIdFrist, 1)
        var promise2 = _getPositionListByCategoryId(currentCandidate.categoryIdSecond, 2)

        let _data = {}
        var promise3 = new Promise(function (resolve, reject) {
            currentCandidate.working.forEach((element) => {
                getPositionListByCategoryId(element.categoryId).then(({ data }) => {
                    let { success, result } = data
                    if (success) {
                        _data[element.id] = objectUtil.sortArray(objectUtil.formForInputSelect(result, "id", "name"), "label")
                        if (Object.keys(_data).length === formDataWorking.length) {
                            setDefaultPositionList(_data)
                            resolve()
                        }
                    } else {
                        dispatch(modalErrorAction.show())
                    }
                }).catch(error => { console.log(error) })
            })
        })

        dispatch(modalLoadingAction.show())

        Promise.all([promise1, promise2, promise3]).then(() => {
            dispatch(modalLoadingAction.close())

            setSkillList(JSON.parse(JSON.stringify(currentCandidate.skillList)))
            setLanguageSkillList(JSON.parse(JSON.stringify(currentCandidate.languageSkillList)))
            setFormDataSkill(JSON.parse(JSON.stringify(currentCandidate.skill)))
            setFormDataLanguageSkill(JSON.parse(JSON.stringify(currentCandidate.languageSkill)))
            setFormDataEdcution(JSON.parse(JSON.stringify(currentCandidate.education)))
            setFormDataWorking(JSON.parse(JSON.stringify(currentCandidate.working)))

            formDataCandidate.categoryIdFrist = currentCandidate.categoryIdFrist
            formDataCandidate.positionAppliedFirst = currentCandidate.positionAppliedFirst
            formDataCandidate.categoryIdSecond = currentCandidate.categoryIdSecond
            formDataCandidate.positionAppliedSecond = currentCandidate.positionAppliedSecond
            formDataCandidate.firstName = currentCandidate.firstName
            formDataCandidate.lastName = currentCandidate.lastName
            formDataCandidate.nationalityId = currentCandidate.nationalityId
            formDataCandidate.nidType = currentCandidate.nidType
            formDataCandidate.nidNumber = currentCandidate.nidNumber

            formDataCandidate.nickname = currentCandidate.nickname
            formDataCandidate.salaryExpect = currentCandidate.salaryExpect
            formDataCandidate.address = currentCandidate.address
            formDataCandidate.provinceId = currentCandidate.provinceId
            formDataCandidate.phoneNumber = currentCandidate.phoneNumber
            formDataCandidate.email = currentCandidate.email
            formDataCandidate.gendar = currentCandidate.gendar
            formDataCandidate.maritalStatus = currentCandidate.maritalStatus
            formDataCandidate.dateOfBirth = currentCandidate.dateOfBirth
            formDataCandidate.height = currentCandidate.height
            formDataCandidate.drivingLicense = currentCandidate.drivingLicense
            formDataCandidate.ownCar = currentCandidate.ownCar
            formDataCandidate.comment = currentCandidate.comment
            formDataCandidate.resume = {}
            formDataCandidate.picture = {}
            // document.getElementById("resume").value = {}
            // document.getElementById("picture").value = {}

            setIsReset(true)
            setTimeout(() => {
                setIsReset(false)
            }, 1)
        })
    }

    let handleDiscard = () => {
        setTitleModalNormal("Discard!")
        setDesModalNormal("Are you sure to discard?")
        setSwapColorModalNormal(true)
        setModeModalNormal("discard")
        setShowModalNormal(true)
    }

    let handleOkModals = () => {
        switch (modeModalNormal) {
            case "create":
                setShowModalNormal(false)
                dispatch(modalLoadingAction.show())

                formDataCandidate.education = formDataEdcution
                formDataCandidate.skill = formDataSkill
                formDataCandidate.languageSkill = formDataLanguageSkill
                formDataCandidate.working = formDataWorking

                var formData = new FormData()

                for (var key in formDataCandidate) {
                    if (key === "education") {
                        formData.append(key, JSON.stringify(formDataCandidate[key]))
                    } else if (key === "skill") {
                        formData.append(key, JSON.stringify(formDataCandidate[key]))
                    } else if (key === "languageSkill") {
                        formData.append(key, JSON.stringify(formDataCandidate[key]))
                    } else if (key === "working") {
                        formData.append(key, JSON.stringify(formDataCandidate[key]))
                    } else if (key === "drivingLicense" || key === "ownCar") {
                        formData.append(key, formDataCandidate[key] ? 1 : 0)
                    } else {
                        formData.append(key, formDataCandidate[key])
                    }
                }

                createCandidate(formData).then(({ data }) => {
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
            case "edit":
                let educationWithFlag = []
                Array.prototype.push.apply(educationWithFlag, getDeleteEducation())
                Array.prototype.push.apply(educationWithFlag, getCreateEducation())
                Array.prototype.push.apply(educationWithFlag, getUpdateEducation())

                let skillWithFlag = []
                Array.prototype.push.apply(skillWithFlag, getUpdateSkill())
                Array.prototype.push.apply(skillWithFlag, getDeleteSkill())
                Array.prototype.push.apply(skillWithFlag, getCreateSkill())

                let languageSkillWithFlag = []
                Array.prototype.push.apply(languageSkillWithFlag, getDeleteLanguageSkill())
                Array.prototype.push.apply(languageSkillWithFlag, getCreateLanguageSkill())
                Array.prototype.push.apply(languageSkillWithFlag, getUpdateLanguageSkill())

                let workingWithFlag = []
                Array.prototype.push.apply(workingWithFlag, getDeleteWorking())
                Array.prototype.push.apply(workingWithFlag, getCreateWorking())
                Array.prototype.push.apply(workingWithFlag, getUpdateWorking())

                formDataCandidate.education = educationWithFlag
                formDataCandidate.skill = skillWithFlag
                formDataCandidate.languageSkill = languageSkillWithFlag
                formDataCandidate.working = workingWithFlag

                var formDataEdit = new FormData()

                for (var keyEdit in formDataCandidate) {
                    if (keyEdit === "education") {
                        formDataEdit.append(keyEdit, JSON.stringify(formDataCandidate[keyEdit]))
                    } else if (keyEdit === "skill") {
                        formDataEdit.append(keyEdit, JSON.stringify(formDataCandidate[keyEdit]))
                    } else if (keyEdit === "languageSkill") {
                        formDataEdit.append(keyEdit, JSON.stringify(formDataCandidate[keyEdit]))
                    } else if (keyEdit === "working") {
                        formDataEdit.append(keyEdit, JSON.stringify(formDataCandidate[keyEdit]))
                    } else if (keyEdit === "drivingLicense" || keyEdit === "ownCar") {
                        formDataEdit.append(keyEdit, formDataCandidate[keyEdit] ? 1 : 0)
                    } else {
                        formDataEdit.append(keyEdit, formDataCandidate[keyEdit])
                    }
                }

                setShowModalNormal(false)
                dispatch(modalLoadingAction.show())

                editCandidate(formDataEdit).then(({ data }) => {
                    let { success, result } = data
                    if (success) {
                        store.addNotification(toatConstant.saveDataSuccess())
                        history.replace(`/candidate/${result[0].id.toString()}`)
                    } else {
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

    let getUpdateSkillBefore = () => {
        return currentCandidate.skill.filter(element => {
            let x = false
            formDataSkill.forEach(_element => {
                if (element.skillId === _element.skillId) {
                    x = true
                }
            })
            return x
        })
    }

    let getUpdateSkillAfter = () => {
        return formDataSkill.filter(element => {
            let x = false
            currentCandidate.skill.forEach(_element => {
                if (element.skillId === _element.skillId) {
                    x = true
                }
            })
            return x
        })
    }

    let getUpdateSkill = () => {
        let updateSkillAfter = getUpdateSkillAfter()
        return getUpdateSkillBefore().map(element => {
            let experience = -1
            updateSkillAfter.forEach(_element => {
                if (element.skillId === _element.skillId) {
                    experience = _element.experience
                }
            })
            return {
                ...element,
                experience: experience,
                flag: "Update"
            }
        })
    }

    let getUpdateLanguageSkillBefore = () => {
        return currentCandidate.languageSkill.filter(element => {
            let x = false
            formDataLanguageSkill.forEach(_element => {
                if (element.languageSkillId === _element.languageSkillId) {
                    x = true
                }
            })
            return x
        })
    }

    let getUpdateLanguageSkillAfter = () => {
        return formDataLanguageSkill.filter(element => {
            let x = false
            currentCandidate.languageSkill.forEach(_element => {
                if (element.languageSkillId === _element.languageSkillId) {
                    x = true
                }
            })
            return x
        })
    }

    let getUpdateLanguageSkill = () => {
        let updateLanguageSkillAfter = getUpdateLanguageSkillAfter()
        return getUpdateLanguageSkillBefore().map(element => {
            let listening = -1
            let speaking = -1
            let reading = -1
            let writing = -1
            updateLanguageSkillAfter.forEach(_element => {
                if (element.languageSkillId === _element.languageSkillId) {
                    listening = _element.listening
                    speaking = _element.speaking
                    reading = _element.reading
                    writing = _element.writing
                }
            })
            return {
                ...element,
                listening: listening,
                speaking: speaking,
                reading: reading,
                writing: writing,
                flag: "Update"
            }
        })
    }

    let getUpdateEducationBefore = () => {
        return currentCandidate.education.filter(element => {
            let x = false
            formDataEdcution.forEach(_element => {
                if (element.id === _element.id) {
                    x = true
                }
            })
            return x
        })
    }

    let getUpdateEducationAfter = () => {
        return formDataEdcution.filter(element => {
            let x = false
            currentCandidate.education.forEach(_element => {
                if (element.id === _element.id) {
                    x = true
                }
            })
            return x
        })
    }

    let getUpdateEducation = () => {
        let updateEducationAfter = getUpdateEducationAfter()
        return getUpdateEducationBefore().map(element => {
            let levelType = -1
            let instituteName = -1
            let major = -1
            let gpa = -1
            let graduate = -1
            updateEducationAfter.forEach(_element => {
                if (element.id === _element.id) {
                    levelType = _element.levelType
                    instituteName = _element.instituteName
                    major = _element.major
                    gpa = _element.gpa
                    graduate = _element.graduate
                }
            })
            return {
                ...element,
                levelType: levelType,
                instituteName: instituteName,
                major: major,
                gpa: gpa,
                graduate: graduate,
                flag: "Update"
            }
        })
    }

    let getUpdateWorkingBefore = () => {
        return currentCandidate.working.filter(element => {
            let x = false
            formDataWorking.forEach(_element => {
                if (element.id === _element.id) {
                    x = true
                }
            })
            return x
        })
    }

    let getUpdateWorkingAfter = () => {
        return formDataWorking.filter(element => {
            let x = false
            currentCandidate.working.forEach(_element => {
                if (element.id === _element.id) {
                    x = true
                }
            })
            return x
        })
    }

    let getUpdateWorking = () => {
        let updateWorkingAfter = getUpdateWorkingAfter()
        return getUpdateWorkingBefore().map(element => {
            let companyName = -1
            let categoryId = -1
            let categoryName = -1
            let positionId = -1
            let positionName = -1
            let salary = -1
            let bonus = -1
            let startDate = -1
            let endDate = -1
            let reason = -1
            updateWorkingAfter.forEach(_element => {
                if (element.id === _element.id) {
                    companyName = _element.companyName
                    categoryId = _element.categoryId
                    categoryName = _element.categoryName
                    positionId = _element.positionId
                    positionName = _element.positionName
                    salary = _element.salary
                    bonus = _element.bonus
                    startDate = _element.startDate
                    endDate = _element.endDate
                    reason = _element.reason
                }
            })
            return {
                ...element,
                companyName: companyName,
                categoryId: categoryId,
                categoryName: categoryName,
                positionId: positionId,
                positionName: positionName,
                salary: salary,
                bonus: bonus,
                startDate: startDate,
                endDate: endDate,
                reason: reason,
                flag: "Update"
            }
        })
    }

    let getDeleteSkill = () => {
        return currentCandidate.skill.filter(element => {
            let x = true
            formDataSkill.forEach(_element => {
                if (element.skillId === _element.skillId) {
                    x = false
                }
            })
            return x
        }).map(element => ({ ...element, flag: "Delete" }))
    }

    let getDeleteLanguageSkill = () => {
        return currentCandidate.languageSkill.filter(element => {
            let x = true
            formDataLanguageSkill.forEach(_element => {
                if (element.languageSkillId === _element.languageSkillId) {
                    x = false
                }
            })
            return x
        }).map(element => ({ ...element, flag: "Delete" }))
    }

    let getDeleteEducation = () => {
        return currentCandidate.education.filter(element => {
            let x = true
            formDataEdcution.forEach(_element => {
                if (element.id === _element.id) {
                    x = false
                }
            })
            return x
        }).map(element => ({ ...element, flag: "Delete" }))
    }

    let getDeleteWorking = () => {
        return currentCandidate.working.filter(element => {
            let x = true
            formDataWorking.forEach(_element => {
                if (element.id === _element.id) {
                    x = false
                }
            })
            return x
        }).map(element => ({ ...element, flag: "Delete" }))
    }

    let getCreateSkill = () => {
        return formDataSkill.filter(element => {
            let x = true
            currentCandidate.skill.forEach(_element => {
                if (element.skillId === _element.skillId) {
                    x = false
                }
            })
            return x
        }).map(element => ({ ...element, candidateId: id, flag: "Insert" }))
    }

    let getCreateLanguageSkill = () => {
        return formDataLanguageSkill.filter(element => {
            let x = true
            currentCandidate.languageSkill.forEach(_element => {
                if (element.languageSkillId === _element.languageSkillId) {
                    x = false
                }
            })
            return x
        }).map(element => ({ ...element, candidateId: id, flag: "Insert" }))
    }

    let getCreateEducation = () => {
        return formDataEdcution.filter(element => {
            let x = true
            currentCandidate.education.forEach(_element => {
                if (element.id === _element.id) {
                    x = false
                }
            })
            return x
        }).map(element => ({ ...element, candidateId: id, flag: "Insert" }))
    }

    let getCreateWorking = () => {
        return formDataWorking.filter(element => {
            let x = true
            currentCandidate.working.forEach(_element => {
                if (element.id === _element.id) {
                    x = false
                }
            })
            return x
        }).map(element => ({ ...element, candidateId: id, flag: "Insert" }))
    }

    return (
        <>
            {isLoadData ? (
                <div className={"spinner"}>
                    <Spinner animation="grow" variant="primary" />
                </div>) :
                (<>
                    <Topic title={"Candidate"} subTitle={mode} />
                    <Row>
                        <Box
                            body={() => (
                                <Row>
                                    <InputSelect xs={12} sm={6} lg={6} label={"Category (1st)"} id={"categoryIdFrist"} placeholder={"Category"} optionsList={categoryList} onChange={handleChangeInput} isSearchable={true} defaultValue={currentCandidate.categoryIdFrist} resest={isReset} />
                                    <InputSelect xs={12} sm={6} lg={6} label={"Position Applied (1st)"} id={"positionAppliedFirst"} placeholder={"Position Applied"} optionsList={positionList1} onChange={handleChangeInput} isSearchable={true} defaultValue={currentCandidate.positionAppliedFirst} resest={isReset} />
                                    <InputSelect xs={12} sm={6} lg={6} label={"Category (2nd)"} id={"categoryIdSecond"} placeholder={"Category"} optionsList={categoryList} onChange={handleChangeInput} isSearchable={true} defaultValue={currentCandidate.categoryIdSecond} resest={isReset} />
                                    <InputSelect xs={12} sm={6} lg={6} label={"Position Applied (2nd)"} id={"positionAppliedSecond"} placeholder={"Position Applied"} optionsList={positionList2} onChange={handleChangeInput} isSearchable={true} defaultValue={currentCandidate.positionAppliedSecond} resest={isReset} />

                                    <Input xs={12} sm={6} lg={4} label={"Profile"} warning={"jpg, jpeg, png"} id={"picture"} onChange={handleChangeInput} defaultNameFile={currentCandidate.namePicture} type={"file"} typeFile=".jpg,.jpeg,.png" resest={isReset} />
                                    <Input xs={12} sm={6} lg={4} label={"Resume"} warning={"pdf"} id={"resume"} onChange={handleChangeInput} defaultNameFile={currentCandidate.nameResume} type={"file"} typeFile=".pdf" resest={isReset} />
                                    <Col xs={0} sm={0} lg={3}></Col>

                                    <Input xs={12} sm={6} lg={4} label={"First Name"} id={"firstName"} onChange={handleChangeInput} defaultValue={currentCandidate.firstName} resest={isReset} />
                                    <Input xs={12} sm={6} lg={4} label={"Last Name"} id={"lastName"} onChange={handleChangeInput} defaultValue={currentCandidate.lastName} resest={isReset} />
                                    <Input xs={12} sm={6} lg={4} label={"Nickname"} id={"nickname"} onChange={handleChangeInput} defaultValue={currentCandidate.nickname} resest={isReset} />
                                    <InputSelect xs={12} sm={6} lg={4} label={"Nationality"} id={"nationalityId"} optionsList={nationalityList} onChange={handleChangeInput} defaultValue={currentCandidate.nationalityId} isSearchable={true} resest={isReset} />
                                    <InputSelect xs={12} sm={6} lg={4} label={"NID Type"} id={"nidType"} optionsList={generalConstant.nidTypeList} onChange={handleChangeInput} defaultValue={currentCandidate.nidType} resest={isReset} />
                                    <Input xs={12} sm={6} lg={4} label={"NID Number"} id={"nidNumber"} onChange={handleChangeInput} defaultValue={currentCandidate.nidNumber} resest={isReset} />
                                    <Input xs={12} sm={6} lg={4} label={"Date Of Birth"} id={"dateOfBirth"} onChange={handleChangeInput} defaultValue={currentCandidate.dateOfBirth} type={"date"} resest={isReset} />
                                    <InputSelect xs={12} sm={6} lg={4} label={"Gendar"} id={"gendar"} optionsList={generalConstant.gendarList} onChange={handleChangeInput} defaultValue={currentCandidate.gendar} resest={isReset} />
                                    <InputSelect xs={12} sm={6} lg={4} label={"Marital"} id={"maritalStatus"} optionsList={generalConstant.maritalList} onChange={handleChangeInput} defaultValue={currentCandidate.maritalStatus} resest={isReset} />
                                    <Input xs={12} sm={6} lg={4} label={"Height"} id={"height"} onChange={handleChangeInput} defaultValue={currentCandidate.height} type={"number"} unit={"CM"} resest={isReset} />
                                    <Input xs={12} sm={6} lg={4} label={"Email"} id={"email"} onChange={handleChangeInput} defaultValue={currentCandidate.email} resest={isReset} />
                                    <Input xs={12} sm={6} lg={4} label={"Phone"} id={"phoneNumber"} onChange={handleChangeInput} defaultValue={currentCandidate.phoneNumber} resest={isReset} />
                                    <Input xs={12} sm={6} lg={4} label={"Salary Expect"} id={"salaryExpect"} onChange={handleChangeInput} defaultValue={currentCandidate.salaryExpect} type={"number"} unit={"Baht"} resest={isReset} />
                                    <Input xs={6} sm={3} lg={2} label={"Driving License"} id={"drivingLicense"} onChange={handleChangeInput} type={"checkbox"} defaultValue={currentCandidate.drivingLicense} resest={isReset} />
                                    <Input xs={6} sm={3} lg={2} label={"Own Car"} id={"ownCar"} onChange={handleChangeInput} type={"checkbox"} defaultValue={currentCandidate.ownCar} resest={isReset} />

                                    <Col xs={0} sm={0} lg={9}></Col>
                                    <Input xs={12} sm={12} lg={4} label={"Address"} id={"address"} onChange={handleChangeInput} type={"textarea"} defaultValue={currentCandidate.address} resest={isReset} />
                                    <Col xs={12} sm={12} lg={8} className={"no-padding"}>
                                        <Row>
                                            <InputSelect xs={12} sm={6} lg={6} label={"Provice"} id={"provinceId"} optionsList={proviceList} onChange={handleChangeInput} isSearchable={true} defaultValue={currentCandidate.provinceId} resest={isReset} />
                                            <InputSelect xs={12} sm={6} lg={6} label={"Amphure"} id={"amphureId"} optionsList={amphurList} onChange={handleChangeInput} isSearchable={true} defaultValue={currentCandidate.amphureId} resest={isReset} />
                                            <InputSelect xs={12} sm={6} lg={6} label={"District"} id={"districtId"} optionsList={districtList} onChange={handleChangeInput} isSearchable={true} defaultValue={currentCandidate.districtId} resest={isReset} />
                                        </Row>
                                    </Col>
                                    <Input xs={12} sm={12} lg={4} label={"Comment"} id={"comment"} onChange={handleChangeInput} type={"textarea"} defaultValue={currentCandidate.comment} resest={isReset} />

                                    <CreateEducation formDataEdcution={formDataEdcution} setFormDataEdcution={setFormDataEdcution} isReset={isReset} />
                                    <CreateSkill formDataSkill={formDataSkill} setFormDataSkill={setFormDataSkill} skillList={skillList} setSkillList={setSkillList} isReset={isReset} />
                                    <CreateLanguageSkill formDataLanguageSkill={formDataLanguageSkill} setFormDataLanguageSkill={setFormDataLanguageSkill} languageSkillList={languageSkillList} setLanguageSkillList={setLanguageSkillList} isReset={isReset} />
                                    <CreateWorking formDataWorking={formDataWorking} setFormDataWorking={setFormDataWorking} categoryList={categoryList} isReset={isReset} defaultPositionList={defaultPositionList} />
                                </Row>
                            )}
                            footer={() => (
                                <Row>
                                    <Col xs={6}>
                                        <button onClick={handleDiscard} className="outline-primary-red">Discard</button>
                                    </Col>
                                    <Col xs={6} className={"text-right"}>
                                        {mode === "edit" && <button onClick={handleReset} className="outline-primary-blue">Reset</button>}
                                        <button onClick={handleCreate} className="outline-primary">{mode === "create" ? "Create" : "Edit"}</button>
                                    </Col>
                                </Row>
                            )}
                        />
                    </Row>
                    <ModalNormal title={titleModalNormal} description={desModalNormal} show={showModalNormal} swapColor={swapColorModalNormal}
                        handleClose={() => setShowModalNormal(false)} handleOk={handleOkModals} />
                </>)}
        </>
    )
}

export default CandidateCreate
