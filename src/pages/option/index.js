import React, { useState, useEffect, useCallback } from "react"
// import { useHistory } from "react-router-dom"
import { useDispatch } from "react-redux"
import { objectUtil } from "../../utils/object.util"
// api
import { skillApi, languageSkillApi, positionApi, nationalityApi } from "../../api"
// action
import { modalErrorAction, modalLoadingAction } from "../../actions"
// components
import { Topic, Box, ListOption, ModalForm, ModalNormal, Input } from "../../components"
import { Row, Spinner } from "react-bootstrap"

function Option() {
    // let history = useHistory()
    const dispatch = useDispatch()

    const [showModalForm, setShowModalForm] = useState(false)
    const [titleModalForm, setTitleModalForm] = useState("")
    const [subTitleModalForm, setSubTitleModalForm] = useState("")
    const [modeModalForm, setModeModalForm] = useState("")
    const [labelModalForm, setLabelModalForm] = useState("")

    const [showModalNormal, setShowModalNormal] = useState(false)
    const [titleModalNormal, setTitleModalNormal] = useState("")
    const [desModalNormal, setDesModalNormal] = useState("")
    const [swapColorModalNormal, setSwapColorModalNormal] = useState(false)
    const [modeModalNormal, setModeModalNormal] = useState("")
    const [id, setId] = useState("")

    const [isLoadData, setIsLoadData] = useState(true)
    const { getSkillList, createSkill, editSkill, deleteSkill } = skillApi
    const { getLanguageSkillList, createLanguageSkill, editLanguageSkill, deleteLanguageSkill } = languageSkillApi
    const { getAllList, createPosition, deletePosition, editPosition } = positionApi
    const { getNationalityList, createNationality, editNationality, deleteNationality } = nationalityApi

    const [skilList, setSkillList] = useState()
    const [languageSkillList, setLanguageSkillList] = useState()
    const [nationalityList, setNationalityList] = useState()
    const [positionList, setPositionList] = useState()

    const [formData, setFormData] = useState({
        id: "",
        name: ""
    })

    let showModalError = useCallback(() => {
        dispatch(modalLoadingAction.close())
        dispatch(modalErrorAction.show())
    }, [dispatch])

    let showModalErrorDelete = useCallback((data) => {
        if (data["message"] !== undefined) {
            dispatch(modalErrorAction.setDes(data["message"]))
        }
        dispatch(modalLoadingAction.close())
        dispatch(modalErrorAction.show())
    }, [dispatch])

    let _getSkillList = useCallback(() => {
        return new Promise(function (resolve, reject) {
            getSkillList().then(({ data }) => {
                let { success, result } = data
                if (success) {
                    setSkillList(objectUtil.sortArray(result, "name"))
                    dispatch(modalLoadingAction.close())
                    resolve()
                } else {
                    showModalError()
                }
            }).catch(error => { console.log(error) })
        })
    }, [getSkillList, dispatch, showModalError])

    let _getLanguageSkillList = useCallback(() => {
        return new Promise(function (resolve, reject) {
            getLanguageSkillList().then(({ data }) => {
                let { success, result } = data
                if (success) {
                    setLanguageSkillList(objectUtil.sortArray(result, "name"))
                    dispatch(modalLoadingAction.close())
                    resolve()
                } else {
                    showModalError()
                }
            }).catch(error => { console.log(error) })
        })
    }, [getLanguageSkillList, dispatch, showModalError])

    let _getNationalityList = useCallback(() => {
        return new Promise(function (resolve, reject) {
            getNationalityList().then(({ data }) => {
                let { success, result } = data
                if (success) {
                    setNationalityList(objectUtil.sortArray(result, "name"))
                    dispatch(modalLoadingAction.close())
                    resolve()
                } else {
                    showModalError()
                }
            }).catch(error => { console.log(error) })
        })
    }, [getNationalityList, dispatch, showModalError])

    let _getAllList = useCallback(() => {
        return new Promise(function (resolve, reject) {
            getAllList().then(({ data }) => {
                let { success, result } = data
                if (success) {
                    result = objectUtil.sortArray(result, "name")
                    let position = result.filter((element) => element.parent === null)
                    position = position.map((element) => {
                        let parent = []
                        parent = result.filter((element2) => element.id === element2.parent)
                        return { ...element, parent: parent }
                    })
                    setPositionList(position)
                    dispatch(modalLoadingAction.close())
                    resolve()
                } else {
                    showModalError()
                }
            }).catch(error => { console.log(error) })
        })
    }, [getAllList, dispatch, showModalError])

    useEffect(() => {
        Promise.all([_getSkillList(), _getLanguageSkillList(), _getNationalityList(), _getAllList()]).then(() => {
            setIsLoadData(false)
        })
    }, [_getSkillList, _getLanguageSkillList, _getNationalityList, _getAllList])

    let handleChangeInput = ({ target }) => {
        formData[target.id] = target.value
    }

    let handleClickCreate = (title, parent, id) => {
        setFormData(objectUtil.clearData(formData))
        setModeModalForm("create")
        setTitleModalForm(title)
        setLabelModalForm(title)
        switch (title + parent) {
            case "Skill":
                setSubTitleModalForm("create")
                setShowModalForm(true)
                break
            case "Language":
                setSubTitleModalForm("create")
                setShowModalForm(true)
                break
            case "Nationality":
                setSubTitleModalForm("create")
                setShowModalForm(true)
                break
            case "Category":
                setSubTitleModalForm("create")
                setShowModalForm(true)
                break
            case "Category" + parent:
                setTitleModalForm("Position")
                setLabelModalForm("Position")
                setSubTitleModalForm(`create(${parent})`)
                setId(id)
                setShowModalForm(true)
                break
            default:
                break
        }
    }

    let handleClickEdit = (title, data) => {
        setFormData({ ...data })
        setModeModalForm("edit")
        setTitleModalForm(title)
        setLabelModalForm(title)
        switch (title) {
            case "Skill":
                setSubTitleModalForm(`edit(${data.name})`)
                setShowModalForm(true)
                break
            case "Language":
                setSubTitleModalForm(`edit(${data.name})`)
                setShowModalForm(true)
                break
            case "Nationality":
                setSubTitleModalForm(`edit(${data.name})`)
                setShowModalForm(true)
                break
            case "Category":
                setSubTitleModalForm(`edit(${data.name})`)
                if (typeof data.parent === "number") {
                    setTitleModalForm("Position")
                    setLabelModalForm("Position")
                }
                setShowModalForm(true)
                break
            default:
                break
        }
    }

    let handleClickDelete = (title, data) => {
        setId(data.id)
        setDesModalNormal(`Are you sure to (${data.name})?`)
        setSwapColorModalNormal(false)
        setShowModalNormal(true)
        switch (title) {
            case "Skill":
                setTitleModalNormal("Delete Skill!")
                setModeModalNormal("deleteSkill")
                break
            case "Language":
                setTitleModalNormal("Delete Language!")
                setModeModalNormal("deleteLanguage")
                break
            case "Nationality":
                setTitleModalNormal("Delete Nationality!")
                setModeModalNormal("deleteNationality")
                break
            case "Category":
                setTitleModalNormal("Delete Category!")
                if (typeof data.parent === "number") {
                    setTitleModalNormal("Delete Position!")
                }
                setModeModalNormal("deleteCategory")
                break
            default:
                break
        }
    }

    let handleOkModals = () => {
        switch (modeModalNormal) {
            case "deleteSkill":
                setShowModalNormal(false)
                dispatch(modalLoadingAction.show())

                deleteSkill(id).then(({ data }) => {
                    let { success } = data
                    if (success) {
                        _getSkillList()
                    } else {
                        showModalErrorDelete(data)
                    }
                }).catch(error => { console.log(error) })
                break
            case "deleteLanguage":
                setShowModalNormal(false)
                dispatch(modalLoadingAction.show())

                deleteLanguageSkill(id).then(({ data }) => {
                    let { success } = data
                    if (success) {
                        _getLanguageSkillList()
                    } else {
                        showModalErrorDelete(data)
                    }
                }).catch(error => { console.log(error) })
                break
            case "deleteNationality":
                setShowModalNormal(false)
                dispatch(modalLoadingAction.show())

                deleteNationality(id).then(({ data }) => {
                    let { success } = data
                    if (success) {
                        _getNationalityList()
                    } else {
                        showModalErrorDelete(data)
                    }
                }).catch(error => { console.log(error) })
                break
            case "deleteCategory":
                setShowModalNormal(false)
                dispatch(modalLoadingAction.show())

                deletePosition(id).then(({ data }) => {
                    let { success } = data
                    if (success) {
                        _getAllList()
                    } else {
                        showModalErrorDelete(data)
                    }
                }).catch(error => { console.log(error) })
                break
            default:
                break
        }
    }

    let handleOkModalsForm = () => {
        if (modeModalForm === "create") {
            formData.id = "-"
            var validate1 = objectUtil.formValidate(formData);
            if (validate1) {
                switch (titleModalForm) {
                    case "Skill":
                        setShowModalForm(false)
                        dispatch(modalLoadingAction.show())

                        createSkill(formData).then(({ data }) => {
                            let { success } = data
                            if (success) {
                                _getSkillList()
                            } else {
                                showModalError()
                            }
                        }).catch(error => { console.log(error) })
                        break
                    case "Language":
                        setShowModalForm(false)
                        dispatch(modalLoadingAction.show())

                        createLanguageSkill(formData).then(({ data }) => {
                            let { success } = data
                            if (success) {
                                _getLanguageSkillList()
                            } else {
                                showModalError()
                            }
                        }).catch(error => { console.log(error) })
                        break
                    case "Nationality":
                        setShowModalForm(false)
                        dispatch(modalLoadingAction.show())

                        createNationality(formData).then(({ data }) => {
                            let { success } = data
                            if (success) {
                                _getNationalityList()
                            } else {
                                showModalError()
                            }
                        }).catch(error => { console.log(error) })
                        break
                    case "Category":
                        setShowModalForm(false)
                        dispatch(modalLoadingAction.show())

                        createPosition(formData).then(({ data }) => {
                            let { success } = data
                            if (success) {
                                _getAllList()
                            } else {
                                showModalError()
                            }
                        }).catch(error => { console.log(error) }).finally(() => { delete formData.parent })
                        break
                    case "Position":
                        setShowModalForm(false)
                        dispatch(modalLoadingAction.show())

                        formData.parent = id

                        createPosition(formData).then(({ data }) => {
                            let { success } = data
                            if (success) {
                                _getAllList()
                            } else {
                                showModalError()
                            }
                        }).catch(error => { console.log(error) }).finally(() => { delete formData.parent })
                        break
                    default:
                        break
                }
            }
        } else if (modeModalForm === "edit") {
            var validate2 = objectUtil.formValidate(formData);
            if (validate2) {
                switch (titleModalForm) {
                    case "Skill":
                        setShowModalForm(false)
                        dispatch(modalLoadingAction.show())

                        editSkill(formData).then(({ data }) => {
                            let { success } = data
                            if (success) {
                                _getSkillList()
                            } else {
                                showModalError()
                            }
                        }).catch(error => { console.log(error) })
                        break
                    case "Language":
                        setShowModalForm(false)
                        dispatch(modalLoadingAction.show())

                        editLanguageSkill(formData).then(({ data }) => {
                            let { success } = data
                            if (success) {
                                _getLanguageSkillList()
                            } else {
                                showModalError()
                            }
                        }).catch(error => { console.log(error) })
                        break
                    case "Nationality":
                        setShowModalForm(false)
                        dispatch(modalLoadingAction.show())

                        editNationality(formData).then(({ data }) => {
                            let { success } = data
                            if (success) {
                                _getNationalityList()
                            } else {
                                showModalError()
                            }
                        }).catch(error => { console.log(error) })
                        break
                    case "Category":
                        setShowModalForm(false)
                        dispatch(modalLoadingAction.show())

                        formData.parent = null

                        editPosition(formData).then(({ data }) => {
                            let { success } = data
                            if (success) {
                                _getAllList()
                            } else {
                                showModalError()
                            }
                        }).catch(error => { console.log(error) }).finally(() => { delete formData.parent })
                        break
                    case "Position":
                        setShowModalForm(false)
                        dispatch(modalLoadingAction.show())

                        editPosition(formData).then(({ data }) => {
                            let { success } = data
                            if (success) {
                                _getAllList()
                            } else {
                                showModalError()
                            }
                        }).catch(error => { console.log(error) }).finally(() => { delete formData.parent })
                        break
                    default:
                        break
                }
            }
        }
    }

    return (
        <>
            {isLoadData ? (
                <div className={"spinner"}>
                    <Spinner animation="grow" variant="primary" />
                </div>) :
                (<>
                    <Topic title={"Option"} subTitle={"list"} />
                    <Row>
                        <Box body={() => (
                            <Row>
                                <ListOption title="Category" data={positionList} onClickDelete={handleClickDelete} onClickEdit={handleClickEdit} onClickCreate={handleClickCreate} />
                                <ListOption title="Skill" data={skilList} onClickDelete={handleClickDelete} onClickEdit={handleClickEdit} onClickCreate={handleClickCreate} />
                                <ListOption title="Language" data={languageSkillList} onClickDelete={handleClickDelete} onClickEdit={handleClickEdit} onClickCreate={handleClickCreate} />
                                <ListOption title="Nationality" data={nationalityList} onClickDelete={handleClickDelete} onClickEdit={handleClickEdit} onClickCreate={handleClickCreate} />
                            </Row>
                        )} />
                    </Row>
                </>)}
            <ModalNormal title={titleModalNormal} description={desModalNormal} show={showModalNormal} swapColor={swapColorModalNormal}
                handleClose={() => setShowModalNormal(false)} handleOk={handleOkModals} />
            <ModalForm title={titleModalForm} subTitle={subTitleModalForm} show={showModalForm}
                handleClose={() => setShowModalForm(false)} handleOk={handleOkModalsForm}
                form={() =>
                    <Row>
                        <Input xs={12} sm={12} lg={12} label={labelModalForm} id={"name"} onChange={handleChangeInput} defaultValue={formData.name} />
                        <Input id={"id"} isHidden={true} defaultValue={formData.id} />
                    </Row>
                } />
        </>
    )
}

export default Option
