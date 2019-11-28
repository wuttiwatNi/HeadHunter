import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { objectUtil } from "../../../utils/object.util";
// api
import { positionApi, customerApi, contactApi, skillApi, languageSkillApi, orderApi } from "../../../api";
// action
import { modalErrorAction } from "../../../actions";
import { modalLoadingAction } from "../../../actions";
// components
import { Topic, Box, Input, InputSelect, ModalNormal, CreateSkill, CreateLanguageSkill } from "../../../components";
import { Row, Col, Spinner } from "react-bootstrap";

function OrderCreate({ mode }) {
    let history = useHistory();
    const dispatch = useDispatch();

    const [isLoadData, setIsLoadData] = useState(true);

    const [showModalNormal, setShowModalNormal] = useState(false);
    const [titleModalNormal, setTitleModalNormal] = useState("");
    const [desModalNormal, setDesModalNormal] = useState("");
    const [swapColorModalNormal, setSwapColorModalNormal] = useState(false);
    const [modeModalNormal, setModeModalNormal] = useState("");

    const { getCategoryList, getPositionListByCategoryId } = positionApi;
    const { getCustomerList } = customerApi;
    const { getContactListByCustomerId } = contactApi;
    const { getSkillList } = skillApi;
    const { getLanguageSkillList } = languageSkillApi;
    const { createOrder } = orderApi;

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
        orderSkill: [],
        orderLanguageSkill: []
    });
    const [formDataSkill, setFormDataSkill] = useState([]);
    const [formDataLanguageSkill, setFormDataLanguageSkill] = useState([]);

    const [categoryList, setCategoryList] = useState([]);
    const [positionList, setPositionList] = useState([]);
    const [customerList, setCustomerList] = useState([]);
    const [contactList, setContactList] = useState([]);
    const [skillList, setSkillList] = useState([]);
    const [languageSkillList, setLanguageSkillList] = useState([]);

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
    ]);

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
        });
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
        });
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
        });

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
        });

        var promise3 = new Promise(function (resolve, reject) {
            getSkillList().then(({ data }) => {
                let { success, result } = data
                if (success) {
                    setSkillList(objectUtil.sortArray(objectUtil.formForInputSelect(result, "id", "name"), "label"))
                    resolve()
                } else {
                    dispatch(modalErrorAction.show())
                }
            }).catch(error => { console.log(error) })
        });

        var promise4 = new Promise(function (resolve, reject) {
            getLanguageSkillList().then(({ data }) => {
                let { success, result } = data
                if (success) {
                    setLanguageSkillList(objectUtil.sortArray(objectUtil.formForInputSelect(result, "id", "name"), "label"))
                    resolve()
                } else {
                    dispatch(modalErrorAction.show())
                }
            }).catch(error => { console.log(error) })
        });

        Promise.all([promise1, promise2, promise3, promise4]).then(() => {
            setIsLoadData(false)
        });
    }, [getCategoryList, getCustomerList, getSkillList, getLanguageSkillList, dispatch]);

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
                    console.log(value)
                    _getContactListByCustomerId(value)
                }
                break
            default:
                break
        }
    };

    let clearSelect = (arrayId) => {
        arrayId.forEach(id => {
            formDataOrder[id] = ""
            document.getElementById(`clear-select-${id}`).click()
        })
    }

    let handleCreate = () => {
        let validate3 = objectUtil.formValidateLanguageSkills(formDataLanguageSkill);
        let validate2 = objectUtil.formValidateSkills(formDataSkill);
        let validate1 = objectUtil.formValidate(formDataOrder);
        if (validate1 && validate2 && validate3) {
            setTitleModalNormal(`${mode === "create" ? "Create" : "Edit"}!`)
            setDesModalNormal(`Are you sure to ${mode === "create" ? "Create" : "Edit"}?`)
            setSwapColorModalNormal(false)
            setModeModalNormal(mode)
            setShowModalNormal(true)
        }
    };

    let handleReset = () => {
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

                formDataOrder.orderSkill = formDataSkill
                formDataOrder.orderLanguageSkill = formDataLanguageSkill

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
                // setShowModalNormal(false)
                // dispatch(modalLoadingAction.show())

                // editCustomer(formDataCustomer).then(({ data }) => {
                //     let { success, result } = data
                //     if (success) {
                //         history.replace(`/customer/${result[0].id.toString()}`)
                //     } else {
                //         dispatch(modalErrorAction.show())
                //     }
                // }).catch(error => { console.log(error) }).finally(() => {
                //     dispatch(modalLoadingAction.close())
                // })
                break
            case "discard":
                history.goBack()
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
                    <Topic title={"Order"} subTitle={mode} />
                    <Row>
                        <Box
                            body={() => (
                                <Row>
                                    <InputSelect xs={12} sm={6} lg={3} label={"Category"} id={"categoryId"} optionsList={categoryList} onChange={handleChangeInput} isSearchable={true} defaultValue={formDataOrder.categoryId} />
                                    <InputSelect xs={12} sm={6} lg={3} label={"Position"} id={"positionId"} optionsList={positionList} onChange={handleChangeInput} isSearchable={true} defaultValue={formDataOrder.positionId} />
                                    <InputSelect xs={12} sm={6} lg={3} label={"Company"} id={"customerId"} optionsList={customerList} onChange={handleChangeInput} isSearchable={true} defaultValue={formDataOrder.customerId} />
                                    <InputSelect xs={12} sm={6} lg={3} label={"Contact"} id={"contactId"} optionsList={contactList} onChange={handleChangeInput} isSearchable={true} defaultValue={formDataOrder.contactId} />
                                    <Input xs={12} sm={6} lg={3} label={"Experience"} id={"experience"} onChange={handleChangeInput} defaultValue={formDataOrder.experience} type={"number"} />
                                    <Input xs={12} sm={6} lg={3} label={"Budget"} id={"budget"} onChange={handleChangeInput} defaultValue={formDataOrder.budget} type={"number"} />
                                    <Input xs={12} sm={6} lg={3} label={"Quantity"} id={"quantity"} onChange={handleChangeInput} defaultValue={formDataOrder.quantity} type={"number"} />
                                    <InputSelect xs={12} sm={6} lg={3} label={"Priority"} id={"priority"} optionsList={priorityList} onChange={handleChangeInput} defaultValue={formDataOrder.priority} />
                                    <Input xs={12} sm={6} lg={3} label={"Obsoleted"} id={"obsoleted"} onChange={handleChangeInput} defaultValue={formDataOrder.obsoleted} type={"date"} />
                                    <CreateSkill formDataSkill={formDataSkill} setFormDataSkill={setFormDataSkill} skillList={skillList} setSkillList={setSkillList} />
                                    <CreateLanguageSkill formDataLanguageSkill={formDataLanguageSkill} setFormDataLanguageSkill={setFormDataLanguageSkill} languageSkillList={languageSkillList} setLanguageSkillList={setLanguageSkillList} />
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
    );
}

export default OrderCreate;
