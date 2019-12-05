import React, { useState, useEffect, useCallback } from "react"
import { useHistory, useParams } from "react-router-dom"
import { useDispatch } from "react-redux"
import { objectUtil } from "../../../utils/object.util"
import { format } from "date-fns"
// api
import { positionApi, customerApi, contactApi, skillApi, languageSkillApi, orderApi } from "../../../api"
// action
import { modalErrorAction } from "../../../actions"
import { modalLoadingAction } from "../../../actions"
// components
import { Topic, Box, Input, InputSelect, ModalNormal, CreateSkill, CreateLanguageSkill } from "../../../components"
import { Row, Col, Spinner } from "react-bootstrap"

function OrderCreate({ mode }) {
    let history = useHistory()
    const dispatch = useDispatch()
    const { id } = useParams()

    const [isReset, setIsReset] = useState(false);
    const [isLoadData, setIsLoadData] = useState(true)

    const [showModalNormal, setShowModalNormal] = useState(false)
    const [titleModalNormal, setTitleModalNormal] = useState("")
    const [desModalNormal, setDesModalNormal] = useState("")
    const [swapColorModalNormal, setSwapColorModalNormal] = useState(false)
    const [modeModalNormal, setModeModalNormal] = useState("")

    const { getCategoryList, getPositionListByCategoryId } = positionApi
    const { getCustomerList } = customerApi
    const { getContactListByCustomerId } = contactApi
    const { getSkillList } = skillApi
    const { getLanguageSkillList } = languageSkillApi
    const { getOrder, createOrder, editOrder } = orderApi

    const [currentOrder, setCurrentOrder] = useState({})
    const [formDataOrder] = useState({
        categoryId: "",
        positionId: "",
        customerId: "",
        contactId: "",
        experience: "",
        budget: "",
        quantity: "",
        priority: "",
        obsoleted: "",
        skill: [],
        languageSkill: []
    })
    const [formDataSkill, setFormDataSkill] = useState([])
    const [formDataLanguageSkill, setFormDataLanguageSkill] = useState([])

    const [categoryList, setCategoryList] = useState([])
    const [positionList, setPositionList] = useState([])
    const [customerList, setCustomerList] = useState([])
    const [contactList, setContactList] = useState([])
    const [skillList, setSkillList] = useState([])
    const [languageSkillList, setLanguageSkillList] = useState([])

    const [priorityList] = useState([
        {
            value: 3, label: "Hight"
        },
        {
            value: 2, label: "Normal"
        },
        {
            value: 1, label: "Low"
        }
    ])

    let _getPositionListByCategoryId = useCallback((categoryId) => {
        return new Promise(function (resolve, reject) {
            getPositionListByCategoryId(categoryId).then(({ data }) => {
                let { success, result } = data
                if (success) {
                    setPositionList(objectUtil.sortArray(objectUtil.formForInputSelect(result, "id", "name"), "label"))
                    resolve()
                } else {
                    dispatch(modalErrorAction.show())
                }
            }).catch(error => { console.log(error) })
        })
    }, [getPositionListByCategoryId, dispatch])

    let _getContactListByCustomerId = useCallback((customerId) => {
        return new Promise(function (resolve, reject) {
            getContactListByCustomerId(customerId).then(({ data }) => {
                let { success, result } = data
                if (success) {
                    setContactList(objectUtil.sortArray(objectUtil.formForInputSelect2(result, "id", "firstName", "lastName"), "label"))
                    resolve()
                } else {
                    dispatch(modalErrorAction.show())
                }
            }).catch(error => { console.log(error) })
        })
    }, [getContactListByCustomerId, dispatch])

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

        if (mode === "create") {
            Promise.all([promise1, promise2, promise3, promise4]).then(() => {
                setIsLoadData(false)
            })
        } else {
            getOrder(id).then(({ data }) => {
                let { success, result } = data
                if (success && result.length !== 0) {
                    let { id, categoryId, positionId, customerId, contact, experience, budget, quantity, priority, obsoleted, skill, languageSkill } = result[0]
                    let contactId = contact[0].id
                    formDataOrder.id = id
                    formDataOrder.categoryId = categoryId
                    formDataOrder.positionId = positionId
                    formDataOrder.customerId = customerId
                    formDataOrder.contactId = contactId
                    formDataOrder.experience = experience
                    formDataOrder.budget = budget
                    formDataOrder.quantity = quantity
                    formDataOrder.priority = priority
                    formDataOrder.obsoleted = format(new Date(obsoleted), "yyyy-MM-dd").toString()
                    setFormDataSkill(JSON.parse(JSON.stringify(skill)))
                    setFormDataLanguageSkill(JSON.parse(JSON.stringify(languageSkill)))

                    var promiseSet1 = _getPositionListByCategoryId(categoryId)
                    var promiseSet2 = _getContactListByCustomerId(customerId)

                    Promise.all([promiseSet1, promiseSet2, promise1, promise2, promise3, promise4]).then((result) => {
                        // Filter skill list
                        let _skillList = result[4].filter(element => {
                            let result = true;
                            skill.forEach(_element => {
                                if (element.value === _element.skillId) {
                                    result = false
                                }
                            });
                            return result
                        });
                        // Filter language skill list
                        let _languageSkillList = result[5].filter(element => {
                            let result = true;
                            languageSkill.forEach(_element => {
                                if (element.value === _element.languageSkillId) {
                                    result = false
                                }
                            });
                            return result
                        });
                        setSkillList(_skillList)
                        setLanguageSkillList(_languageSkillList)
                        setIsLoadData(false)
                        setCurrentOrder({
                            ...formDataOrder,
                            skill: JSON.parse(JSON.stringify(skill)),
                            languageSkill: JSON.parse(JSON.stringify(languageSkill)),
                            skillList: JSON.parse(JSON.stringify(_skillList)),
                            languageSkillList: JSON.parse(JSON.stringify(_languageSkillList))
                        })
                    })
                } else {
                    dispatch(modalErrorAction.show())
                }
            }).catch(error => { console.log(error) })
        }
    }, [getCategoryList, getCustomerList, getSkillList, getLanguageSkillList, dispatch, _getContactListByCustomerId, _getPositionListByCategoryId, formDataOrder, getOrder, id, mode])

    let handleChangeInput = ({ target }) => {
        let { id, value } = target
        formDataOrder[id] = value

        switch (id) {
            case "categoryId":
                if (value) {
                    clearSelect(["positionId"])
                    _getPositionListByCategoryId(value)
                }
                break
            case "customerId":
                if (value) {
                    clearSelect(["contactId"])
                    _getContactListByCustomerId(value)
                }
                break
            default:
                break
        }
    }

    let clearSelect = (arrayId) => {
        arrayId.forEach(id => {
            formDataOrder[id] = ""
            document.getElementById(`clear-select-${id}`).click()
        })
    }

    let handleCreate = () => {
        let validate3 = objectUtil.formValidateLanguageSkills(formDataLanguageSkill)
        let validate2 = objectUtil.formValidateSkills(formDataSkill)
        let validate1 = objectUtil.formValidate(formDataOrder)
        if (validate1 && validate2 && validate3) {
            setTitleModalNormal(`${mode === "create" ? "Create" : "Edit"}!`)
            setDesModalNormal(`Are you sure to ${mode === "create" ? "Create" : "Edit"}?`)
            setSwapColorModalNormal(false)
            setModeModalNormal(mode)
            setShowModalNormal(true)
        }
    }

    let handleReset = () => {
        var promise1 = _getPositionListByCategoryId(currentOrder.categoryId)
        var promise2 = _getContactListByCustomerId(currentOrder.customerId)

        Promise.all([promise1, promise2]).then(() => {
            setSkillList(JSON.parse(JSON.stringify(currentOrder.skillList)))
            setLanguageSkillList(JSON.parse(JSON.stringify(currentOrder.languageSkillList)))
            setFormDataSkill(JSON.parse(JSON.stringify(currentOrder.skill)))
            setFormDataLanguageSkill(JSON.parse(JSON.stringify(currentOrder.languageSkill)))

            formDataOrder.categoryId = currentOrder.categoryId
            formDataOrder.positionId = currentOrder.positionId
            formDataOrder.customerId = currentOrder.customerId
            formDataOrder.contactId = currentOrder.contactId
            formDataOrder.experience = currentOrder.experience
            formDataOrder.budget = currentOrder.budget
            formDataOrder.quantity = currentOrder.quantity
            formDataOrder.priority = currentOrder.priority
            formDataOrder.obsoleted = format(new Date(currentOrder.obsoleted), "yyyy-MM-dd").toString()

            setIsReset(true)
            setTimeout(() => {
                setIsReset(false)
            }, 1)
        });
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

                formDataOrder.skill = formDataSkill
                formDataOrder.languageSkill = formDataLanguageSkill

                createOrder(formDataOrder).then(({ data }) => {
                    let { success, result } = data
                    if (success) {
                        history.replace(result[0].id.toString())
                    } else {
                        dispatch(modalErrorAction.show())
                    }
                }).catch(error => { console.log(error) }).finally(() => {
                    dispatch(modalLoadingAction.close())
                })
                break
            case "edit":
                let skillWithFlag = []
                Array.prototype.push.apply(skillWithFlag, getUpdateSkill());
                Array.prototype.push.apply(skillWithFlag, getDeleteSkill());
                Array.prototype.push.apply(skillWithFlag, getCreateSkill());

                let languageSkillWithFlag = []
                Array.prototype.push.apply(languageSkillWithFlag, getDeleteLanguageSkill());
                Array.prototype.push.apply(languageSkillWithFlag, getCreateLanguageSkill());
                Array.prototype.push.apply(languageSkillWithFlag, getUpdateLanguageSkill());

                formDataOrder.skill = skillWithFlag
                formDataOrder.languageSkill = languageSkillWithFlag

                setShowModalNormal(false)
                dispatch(modalLoadingAction.show())

                editOrder(formDataOrder).then(({ data }) => {
                    let { success, result } = data
                    if (success) {
                        history.replace(`/order/${result[0].id.toString()}`)
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
        return currentOrder.skill.filter(element => {
            let x = false
            formDataSkill.forEach(_element => {
                if (element.skillId === _element.skillId) {
                    x = true
                }
            })
            return x
        });
    }

    let getUpdateSkillAfter = () => {
        return formDataSkill.filter(element => {
            let x = false
            currentOrder.skill.forEach(_element => {
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
            return { ...element, experience: experience, flag: "Update" }
        });
    }

    let getUpdateLanguageSkillBefore = () => {
        return currentOrder.languageSkill.filter(element => {
            let x = false
            formDataLanguageSkill.forEach(_element => {
                if (element.languageSkillId === _element.languageSkillId) {
                    x = true
                }
            })
            return x
        });
    }

    let getUpdateLanguageSkillAfter = () => {
        return formDataLanguageSkill.filter(element => {
            let x = false
            currentOrder.languageSkill.forEach(_element => {
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
            return { ...element, listening: listening, speaking: speaking, reading: reading, writing: writing, flag: "Update" }
        });
    }

    let getDeleteSkill = () => {
        return currentOrder.skill.filter(element => {
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
        return currentOrder.languageSkill.filter(element => {
            let x = true
            formDataLanguageSkill.forEach(_element => {
                if (element.languageSkillId === _element.languageSkillId) {
                    x = false
                }
            })
            return x
        }).map(element => ({ ...element, flag: "Delete" }))
    }

    let getCreateSkill = () => {
        return formDataSkill.filter(element => {
            let x = true
            currentOrder.skill.forEach(_element => {
                if (element.skillId === _element.skillId) {
                    x = false
                }
            })
            return x
        }).map(element => ({ ...element, orderId: id, flag: "Insert" }))
    }

    let getCreateLanguageSkill = () => {
        return formDataLanguageSkill.filter(element => {
            let x = true
            currentOrder.languageSkill.forEach(_element => {
                if (element.languageSkillId === _element.languageSkillId) {
                    x = false
                }
            })
            return x
        }).map(element => ({ ...element, orderId: id, flag: "Insert" }))
    }

    return (
        <>
            {isLoadData ? (
                <div className={"spinner"}>
                    <Spinner animation="grow" variant="primary" />
                </div>) :
                (<>
                    <Topic title={"Order"} subTitle={mode} />
                    <Row>
                        <Box
                            body={() => (
                                <Row>
                                    <InputSelect xs={12} sm={6} lg={3} label={"Category"} id={"categoryId"} optionsList={categoryList} onChange={handleChangeInput} isSearchable={true} defaultValue={currentOrder.categoryId} resest={isReset} />
                                    <InputSelect xs={12} sm={6} lg={3} label={"Position"} id={"positionId"} optionsList={positionList} onChange={handleChangeInput} isSearchable={true} defaultValue={currentOrder.positionId} resest={isReset} />
                                    <InputSelect xs={12} sm={6} lg={3} label={"Company"} id={"customerId"} optionsList={customerList} onChange={handleChangeInput} isSearchable={true} defaultValue={currentOrder.customerId} resest={isReset} />
                                    <InputSelect xs={12} sm={6} lg={3} label={"Contact"} id={"contactId"} optionsList={contactList} onChange={handleChangeInput} isSearchable={true} defaultValue={currentOrder.contactId} resest={isReset} />
                                    <Input xs={12} sm={6} lg={3} label={"Experience"} id={"experience"} onChange={handleChangeInput} defaultValue={currentOrder.experience} type={"number"} unit={"Year"} resest={isReset} />
                                    <Input xs={12} sm={6} lg={3} label={"Budget"} id={"budget"} onChange={handleChangeInput} defaultValue={currentOrder.budget} type={"number"} unit={"Baht"} resest={isReset} />
                                    <Input xs={12} sm={6} lg={3} label={"Quantity"} id={"quantity"} onChange={handleChangeInput} defaultValue={currentOrder.quantity} type={"number"} unit={"Person"} resest={isReset} />
                                    <InputSelect xs={12} sm={6} lg={3} label={"Priority"} id={"priority"} optionsList={priorityList} onChange={handleChangeInput} defaultValue={currentOrder.priority} resest={isReset} />
                                    <Input xs={12} sm={6} lg={3} label={"Obsoleted"} id={"obsoleted"} onChange={handleChangeInput} defaultValue={currentOrder.obsoleted} type={"date"} resest={isReset} />
                                    <CreateSkill formDataSkill={formDataSkill} setFormDataSkill={setFormDataSkill} skillList={skillList} setSkillList={setSkillList} isReset={isReset} />
                                    <CreateLanguageSkill formDataLanguageSkill={formDataLanguageSkill} setFormDataLanguageSkill={setFormDataLanguageSkill} languageSkillList={languageSkillList} setLanguageSkillList={setLanguageSkillList} isReset={isReset} />
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

export default OrderCreate
