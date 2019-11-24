import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { objectUtil } from "../../../utils/object.util";
// api
import { masterApi, customerApi } from "../../../api";
// action
import { modalErrorAction } from "../../../actions";
import { modalLoadingAction } from "../../../actions";
// components
import { Topic, Box, Input, InputSelect, ModalNormal } from "../../../components";
import { Row, Col } from "react-bootstrap";

function CustomerCreate({ mode }) {
    const history = useHistory();
    const dispatch = useDispatch();
    const [showModalNormal, setShowModalNormal] = useState(false);
    const [titleModalNormal, setTitleModalNormal] = useState("");
    const [desModalNormal, setDesModalNormal] = useState("");
    const [swapColorModalNormal, setSwapColorModalNormal] = useState(false);
    const [modeModalNormal, setModeModalNormal] = useState("");

    const { getProvinceList, getAmphureListByProvinceId, getDistrictListByAmphureId } = masterApi;
    const { createCustomer } = customerApi;

    const [formDataCustomer] = useState({
        companyName: "",
        address: "",
        proviceId: "",
        amphureId: "",
        districtId: "",
        taxNumber: "",
        phoneNumber: "",
        contact: []
    });

    const [proviceList, setProviceList] = useState([]);
    const [amphurList, setAmphureList] = useState([]);
    const [districtList, setDistrictList] = useState([]);

    useEffect(() => {
        getProvinceList().then(({ data }) => {
            let { success, result } = data
            if (success) {
                setProviceList(objectUtil.formForInputSelect(result, "id", "nameTH"))
            } else {
                dispatch(modalErrorAction.show())
            }
        }).catch(error => { console.log(error) })
    }, [getProvinceList, dispatch]);

    let _getAmphureListByProvinceId = (proviceId) => {
        getAmphureListByProvinceId(proviceId).then(({ data }) => {
            let { success, result } = data
            if (success) {
                setAmphureList(objectUtil.formForInputSelect(result, "id", "nameTH"))
            } else {
                dispatch(modalErrorAction.show())
            }
        }).catch(error => { console.log(error) })
    }

    let _getDistrictListByAmphureId = (proviceId) => {
        getDistrictListByAmphureId(proviceId).then(({ data }) => {
            let { success, result } = data
            if (success) {
                setDistrictList(objectUtil.formForInputSelect(result, "id", "nameTH"))
            } else {
                dispatch(modalErrorAction.show())
            }
        }).catch(error => { console.log(error) })
    }

    let handleChangeInput = ({ target }) => {
        let { id, value } = target
        formDataCustomer[id] = value

        switch (id) {
            case "proviceId":
                clearSelect(["amphureId", "districtId"])
                _getAmphureListByProvinceId(value)
                break
            case "amphureId":
                clearSelect(["districtId"])
                _getDistrictListByAmphureId(value)
                break
            default:
                break
        }
    };

    let clearSelect = (arrayId) => {
        arrayId.forEach(id => {
            formDataCustomer[id] = ""
            document.getElementById(`clear-select-${id}`).click()
        })
    }

    let handleCreate = () => {
        let validate = objectUtil.formValidate(formDataCustomer);
        if (validate) {
            setTitleModalNormal("Create!")
            setDesModalNormal("Are you sure to create?")
            setSwapColorModalNormal(false)
            setModeModalNormal("create")
            setShowModalNormal(true)
        }
    };

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

                createCustomer(formDataCustomer).then(({ data }) => {
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
            case "discard":
                history.goBack()
                break
            default:
                break
        }
    }

    return (
        <>
            <Topic title={"Customer"} subTitle={"create"} />
            <Row>
                <Box
                    body={() => (
                        <Row>
                            <Input xs={12} sm={6} lg={4} label={"Company"} id={"companyName"} onChange={handleChangeInput} />
                            <Input xs={12} sm={6} lg={4} label={"Tax."} id={"taxNumber"} onChange={handleChangeInput} />
                            <Input xs={12} sm={6} lg={4} label={"Phone"} id={"phoneNumber"} onChange={handleChangeInput} />
                            <Input xs={12} sm={6} lg={4} label={"Address"} id={"address"} onChange={handleChangeInput} type={"textarea"} />
                            <Col xs={12} sm={12} lg={8} className={"no-padding"}>
                                <Row>
                                    <InputSelect xs={12} sm={6} lg={6} label={"Provice"} id={"proviceId"} optionsList={proviceList} onChange={handleChangeInput} isSearchable={true} />
                                    <InputSelect xs={12} sm={6} lg={6} label={"Amphure"} id={"amphureId"} optionsList={amphurList} onChange={handleChangeInput} isSearchable={true} />
                                    <InputSelect xs={12} sm={6} lg={6} label={"District"} id={"districtId"} optionsList={districtList} onChange={handleChangeInput} isSearchable={true} />
                                </Row>
                            </Col>
                        </Row>
                    )}
                    footer={() => (
                        <Row>
                            <Col xs={6}>
                                <button onClick={handleDiscard} className="outline-primary-red">Discard</button>
                            </Col>
                            <Col xs={6} className={"text-right"}>
                                <button onClick={handleCreate} className="outline-primary">Create</button>
                            </Col>
                        </Row>
                    )}
                />
            </Row>
            <ModalNormal title={titleModalNormal} description={desModalNormal} show={showModalNormal} swapColor={swapColorModalNormal}
                handleClose={() => setShowModalNormal(false)} handleOk={handleOkModals} />
        </>
    );
}

export default CustomerCreate;
