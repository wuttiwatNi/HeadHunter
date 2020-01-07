import React, { useEffect } from "react"
import * as PropTypes from "prop-types"
import { Row, Col } from "react-bootstrap"
// constants
import { generalConstant } from "../../constants/index"
// components
import { InputSelect, Input } from "../../components"
import "./index.scss"
let id = -1

function CreateEducation({ formDataEdcution, setFormDataEdcution, isReset }) {
    useEffect(() => {
        if (id === -1) {
            if (formDataEdcution.length >= 1) {
                id = formDataEdcution[0].id
                for (var i = 0; i < formDataEdcution.length; i++) {
                    if (id < formDataEdcution[i].id) {
                        id = formDataEdcution[i].id
                    }
                }
                id += 1
            } else {
                id = 0
            }
        }
    }, [formDataEdcution])

    let handleAddSelect = () => {
        let data = {
            id: id.toString(),
            levelType: "",
            instituteName: "",
            major: "",
            gpa: "",
            graduate: ""
        }
        id = id + 1
        let datas = [...formDataEdcution]
        datas.push(data)
        setFormDataEdcution(datas)
    }

    let handleDeleteSelect = (_id) => {
        for (var i = 0; i < formDataEdcution.length; i++) {
            if (formDataEdcution[i].id === _id) {
                formDataEdcution.splice(i, 1)
            }
        }
        setFormDataEdcution([...formDataEdcution])
    }

    let handleChangeInput = ({ target }) => {
        let { id, value } = target
        let _id = id.split("-")
        let datas = formDataEdcution//JSON.parse(JSON.stringify(formDataEdcution))
        let index = datas.findIndex((element) => element.id.toString() === _id[_id.length - 1].toString())
        datas[index][_id[0]] = value
        setFormDataEdcution(datas)
    }

    return (
        <>
            <Col xs={12} sm={12} lg={12} className={"no-padding main-create-education"}>
                <Row >
                    <Col xs={12} sm={12} lg={12} className={"no-padding header-create-education"}>
                        <Row>
                            <Col xs={6} sm={6} lg={3} className={"title-text"}>
                                Education
                            </Col>
                            <Col xs={6} sm={6} lg={9} className={"title-search no-padding"}>
                                <button className={"outline-primary"} onClick={handleAddSelect}>
                                    <i className={"fa fa-plus"} />
                                </button>
                            </Col>
                        </Row>
                    </Col>
                    {formDataEdcution.map((i, index) => (
                        <Col key={i.id} xs={12} sm={12} lg={6} className={"box-selected no-padding"}>
                            <Row>
                                <Input xs={12} sm={6} lg={6} label={`Institute (${index + 1})`} id={`instituteName-${i.id}`} onChange={handleChangeInput} defaultValue={i.instituteName} resest={isReset} topic={true}/>
                                <InputSelect xs={12} sm={6} lg={6} label={"Level"} id={`levelType-${i.id}`} placeholder={"level"} optionsList={generalConstant.levelEducationList} onChange={handleChangeInput} defaultValue={i.levelType} resest={isReset} />
                                <Input xs={12} sm={4} lg={4} label={"Major"} id={`major-${i.id}`} onChange={handleChangeInput} defaultValue={i.major} resest={isReset} />
                                <Input xs={12} sm={4} lg={4} label={"GPA"} id={`gpa-${i.id}`} onChange={handleChangeInput} type={"number"} defaultValue={i.gpa} resest={isReset} />
                                <Input xs={12} sm={4} lg={4} label={"Graduate"} id={`graduate-${i.id}`} onChange={handleChangeInput} type={"date"} defaultValue={i.graduate} resest={isReset} />
                            </Row>
                            <i className="fa fa-close" onClick={() => handleDeleteSelect(i.id)} />
                        </Col>
                    ))}
                    {formDataEdcution.length === 0 &&
                        <Col xs={12} sm={12} lg={12} className={`no-data`}>
                            <span>No education.</span>
                        </Col>
                    }
                </Row>
            </Col>
        </>
    )
}

CreateEducation.propTypes = {
    formDataEdcution: PropTypes.array
}

CreateEducation.defaultProps = {
    formDataEdcution: []
}

export default CreateEducation
