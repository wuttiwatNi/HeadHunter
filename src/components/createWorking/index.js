import React, { useState } from "react"
import { useDispatch } from "react-redux"
import * as PropTypes from "prop-types"
import { Row, Col } from "react-bootstrap"
import { objectUtil } from "../../utils/object.util"
// api
import { positionApi } from "../../api"
// action
import { modalErrorAction } from "../../actions"
// components
import { InputSelect, Input } from "../../components"
import "./index.scss"
let id = 0

function CreateWorking({ formDataWorking, setFormDataWorking, categoryList, isReset }) {
    const dispatch = useDispatch()
    const { getPositionListByCategoryId } = positionApi
    const [positionList, setPositionList] = useState({})

    let _getPositionListByCategoryId = (categoryId, id) => {
        getPositionListByCategoryId(categoryId).then(({ data }) => {
            let { success, result } = data
            if (success) {
                let _data = { ...positionList }
                _data[id] = objectUtil.sortArray(objectUtil.formForInputSelect(result, "id", "name"), "label")
                setPositionList(_data)
            } else {
                dispatch(modalErrorAction.show())
            }
        }).catch(error => { console.log(error) })
    }

    let handleAddSelect = () => {
        let data = {
            id: id.toString(),
            companyName: "",
            categoryId: "",
            positionId: "",
            salary: "",
            bonus: "",
            reason: "",
            startDate: "",
            endDate: ""
        }
        id = id + 1
        let datas = [...formDataWorking]
        datas.push(data)
        setFormDataWorking(datas)
    };

    let handleDeleteSelect = (_id) => {
        for (var i = 0; i < formDataWorking.length; i++) {
            if (formDataWorking[i].id === _id) {
                formDataWorking.splice(i, 1);
            }
        }
        setFormDataWorking([...formDataWorking])
    };

    let handleChangeInput = ({ target }) => {
        let { id, value } = target
        let _id = id.split("-")
        let datas = JSON.parse(JSON.stringify(formDataWorking))
        let index = datas.findIndex((element) => element.id === _id[_id.length - 1].toString())
        datas[index][_id[0]] = value
        setFormDataWorking(datas)

        switch (_id[0]) {
            case "categoryId":
                if (value) {
                    clearSelect([`positionId-${_id[_id.length - 1]}`], index, datas)
                    _getPositionListByCategoryId(value, _id[_id.length - 1])
                }
                break
            default:
                break
        }
    };

    let clearSelect = (arrayId, index, datas) => {
        arrayId.forEach(id => {
            let data = [...datas]
            data[index]["positionId"] = ""
            setFormDataWorking(data)
            document.getElementById(`clear-select-${id}`).click()
        })
    }

    return (
        <>
            <Col xs={12} sm={12} lg={12} className={"no-padding main-create-education"}>
                <Row >
                    <Col xs={12} sm={12} lg={12} className={"no-padding header-create-education"}>
                        <Row>
                            <Col xs={6} sm={6} lg={3} className={"title-text"}>
                                Work History
                            </Col>
                            <Col xs={6} sm={6} lg={9} className={"title-search no-padding"}>
                                <button className={"outline-primary"} onClick={handleAddSelect}>
                                    <i className={"fa fa-plus"} />
                                </button>
                            </Col>
                        </Row>
                    </Col>
                    {formDataWorking.map((i, index) => (
                        <Col key={i.id} xs={12} sm={12} lg={6} className={"box-selected no-padding"}>
                            <Row>
                                <Input xs={12} sm={12} lg={12} label={`Company (${index + 1})`} id={`companyName-${i.id}`} onChange={handleChangeInput} defaultValue={i.companyName} resest={isReset} />
                                <InputSelect xs={12} sm={6} lg={6} label={"Category"} id={`categoryId-${i.id}`} optionsList={categoryList} onChange={handleChangeInput} defaultValue={i.categoryId} resest={isReset} />
                                <InputSelect xs={12} sm={6} lg={6} label={"Position"} id={`positionId-${i.id}`} optionsList={positionList[i.id]} onChange={handleChangeInput} defaultValue={i.positionId} resest={isReset} />
                                <Input xs={12} sm={6} lg={6} label={"Salary"} id={`salary-${i.id}`} onChange={handleChangeInput} type={"number"} unit={"Baht"} defaultValue={i.salary} resest={isReset} />
                                <Input xs={12} sm={6} lg={6} label={"Bonus"} id={`bonus-${i.id}`} onChange={handleChangeInput} type={"number"} unit={"Month"} defaultValue={i.bonus} resest={isReset} />
                                <Input xs={12} sm={6} lg={6} label={"Resign Reason"} id={`reason-${i.id}`} onChange={handleChangeInput} type={"textarea"} defaultValue={i.reason} resest={isReset} />
                                <Col xs={12} sm={6} lg={6} className={"no-padding"}>
                                    <Row>
                                        <Input xs={6} sm={12} lg={12} label={"Start Date"} id={`startDate-${i.id}`} onChange={handleChangeInput} type={"date"} defaultValue={i.startDate} resest={isReset} />
                                        <Input xs={6} sm={12} lg={12} label={"End Date"} id={`endDate-${i.id}`} onChange={handleChangeInput} type={"date"} defaultValue={i.endDate} resest={isReset} />
                                    </Row>
                                </Col>
                            </Row>
                            <i className="fa fa-close" onClick={() => handleDeleteSelect(i.id)} />
                        </Col>
                    ))}
                    {formDataWorking.length === 0 &&
                        <Col xs={12} sm={12} lg={12} className={`no-data`}>
                            <span>No work history.</span>
                        </Col>
                    }
                </Row>
            </Col>
        </>
    );
}

CreateWorking.propTypes = {
    formDataWorking: PropTypes.array
};

CreateWorking.defaultProps = {
    formDataWorking: []
};

export default CreateWorking;
