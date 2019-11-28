import React, { useState, useEffect, useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { objectUtil } from "../../../utils/object.util";
// api
import { masterApi, customerApi } from "../../../api";
// action
import { modalErrorAction } from "../../../actions";
import { modalLoadingAction } from "../../../actions";
// components
import { Topic, Box, Input, InputSelect, ModalNormal } from "../../../components";
import { Row, Col, Spinner } from "react-bootstrap";

function CustomerCreate({ mode }) {
    const history = useHistory();
    const dispatch = useDispatch();
    const { id } = useParams();

    const [isReset, setIsReset] = useState(false);

    const [showModalNormal, setShowModalNormal] = useState(false);
    const [titleModalNormal, setTitleModalNormal] = useState("");
    const [desModalNormal, setDesModalNormal] = useState("");
    const [swapColorModalNormal, setSwapColorModalNormal] = useState(false);
    const [modeModalNormal, setModeModalNormal] = useState("");

    const { getProvinceList, getAmphureListByProvinceId, getDistrictListByAmphureId } = masterApi;
    const { getCustomer, createCustomer, editCustomer } = customerApi;

    const [currentCustomer, setCurrentCustomer] = useState({});
    const [formDataCustomer] = useState({
        id: "",
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

    let _getAmphureListByProvinceId = useCallback((proviceId) => {
        return new Promise(function (resolve, reject) {
            getAmphureListByProvinceId(proviceId).then(({ data }) => {
                let { success, result } = data
                if (success) {
                    setAmphureList(objectUtil.formForInputSelect(result, "id", "nameTH"))
                    resolve()
                } else {
                    dispatch(modalErrorAction.show())
                }
            }).catch(error => { console.log(error) })
        });
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
        });
    }, [getDistrictListByAmphureId, dispatch])

    useEffect(() => {
        if (mode === "edit") {
            getCustomer(id).then(({ data }) => {
                let { success, result } = data
                if (success && result.length !== 0) {
                    let { id, companyName, address, proviceId, amphureId, districtId, taxNumber, phoneNumber } = result[0]

                    formDataCustomer.id = id
                    formDataCustomer.companyName = companyName
                    formDataCustomer.address = address
                    formDataCustomer.proviceId = proviceId
                    formDataCustomer.amphureId = amphureId
                    formDataCustomer.districtId = districtId
                    formDataCustomer.taxNumber = taxNumber
                    formDataCustomer.phoneNumber = phoneNumber

                    var promise1 = _getAmphureListByProvinceId(proviceId)
                    var promise2 = _getDistrictListByAmphureId(amphureId)

                    Promise.all([promise1, promise2]).then(() => {
                        setCurrentCustomer(result[0])
                    });
                } else {
                    dispatch(modalErrorAction.show())
                }
            }).catch(error => { console.log(error) })
        }

        getProvinceList().then(({ data }) => {
            let { success, result } = data
            if (success) {
                setProviceList(objectUtil.formForInputSelect(result, "id", "nameTH"))
            } else {
                dispatch(modalErrorAction.show())
            }
        }).catch(error => { console.log(error) })
    }, [getProvinceList, _getAmphureListByProvinceId, _getDistrictListByAmphureId, setCurrentCustomer, formDataCustomer, dispatch, getCustomer, id, mode]);

    let handleChangeInput = ({ target }) => {
        let { id, value } = target
        formDataCustomer[id] = value

        switch (id) {
            case "proviceId":
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
    };

    let clearSelect = (arrayId) => {
        arrayId.forEach(id => {
            formDataCustomer[id] = ""
            document.getElementById(`clear-select-${id}`).click()
        })
    }

    let handleCreate = () => {
        if (mode === "create") {
            formDataCustomer.id = "-"
        }
        let validate = objectUtil.formValidate(formDataCustomer);
        if (validate) {
            setTitleModalNormal(`${mode === "create" ? "Create" : "Edit"}!`)
            setDesModalNormal(`Are you sure to ${mode === "create" ? "Create" : "Edit"}?`)
            setSwapColorModalNormal(false)
            setModeModalNormal(mode)
            setShowModalNormal(true)
        }
    };

    let handleReset = () => {
        var promise1 = _getAmphureListByProvinceId(currentCustomer.proviceId)
        var promise2 = _getDistrictListByAmphureId(currentCustomer.amphureId)

        Promise.all([promise1, promise2]).then(() => {
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
            case "edit":
                setShowModalNormal(false)
                dispatch(modalLoadingAction.show())

                editCustomer(formDataCustomer).then(({ data }) => {
                    let { success, result } = data
                    if (success) {
                        history.replace(`/customer/${result[0].id.toString()}`)
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
            {(currentCustomer["companyName"] === undefined && mode === "edit") ? (
                <div className={"spinner"}>
                    <Spinner animation="grow" variant="primary" />
                </div>) :
                (<>
                    <Topic title={"Customer"} subTitle={mode} />
                    <Row>
                        <Box
                            body={() => (
                                <Row>
                                    <Input xs={12} sm={6} lg={4} label={"Company"} id={"companyName"} onChange={handleChangeInput} defaultValue={currentCustomer.companyName} resest={isReset} />
                                    <Input xs={12} sm={6} lg={4} label={"Tax."} id={"taxNumber"} onChange={handleChangeInput} defaultValue={currentCustomer.taxNumber} resest={isReset} />
                                    <Input xs={12} sm={6} lg={4} label={"Phone"} id={"phoneNumber"} onChange={handleChangeInput} defaultValue={currentCustomer.phoneNumber} resest={isReset} />
                                    <Input xs={12} sm={6} lg={4} label={"Address"} id={"address"} onChange={handleChangeInput} type={"textarea"} defaultValue={currentCustomer.address} resest={isReset} />
                                    <Input id={"id"} isHidden={true} defaultValue={currentCustomer.id} resest={isReset} />
                                    <Col xs={12} sm={12} lg={8} className={"no-padding"}>
                                        <Row>
                                            <InputSelect xs={12} sm={6} lg={6} label={"Provice"} id={"proviceId"} optionsList={proviceList} onChange={handleChangeInput} isSearchable={true} defaultValue={currentCustomer.proviceId} resest={isReset} />
                                            <InputSelect xs={12} sm={6} lg={6} label={"Amphure"} id={"amphureId"} optionsList={amphurList} onChange={handleChangeInput} isSearchable={true} defaultValue={currentCustomer.amphureId} resest={isReset} />
                                            <InputSelect xs={12} sm={6} lg={6} label={"District"} id={"districtId"} optionsList={districtList} onChange={handleChangeInput} isSearchable={true} defaultValue={currentCustomer.districtId} resest={isReset} />
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

export default CustomerCreate;
