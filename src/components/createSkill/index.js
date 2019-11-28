import React from "react";
import * as PropTypes from "prop-types";
import { Row, Col } from "react-bootstrap";
import { objectUtil } from "../../utils/object.util";
// components
import { Input, InputSelect } from "../../components";
import "./index.scss";

function CreateSkill({ formDataSkill, setFormDataSkill, skillList, setSkillList }) {

    let handleAddSelect = ({ target }) => {
        let { value, label } = target
        let data = { skillId: value, experience: "", label: label }
        let datas = [...formDataSkill]
        datas.push(data)
        setFormDataSkill(datas)

        for (var i = 0; i < skillList.length; i++) {
            if (skillList[i].value === value) {
                skillList.splice(i, 1);
            }
        }
    };

    let handleDeleteSelect = (data) => {
        let { skillId, label } = data

        for (var i = 0; i < formDataSkill.length; i++) {
            if (formDataSkill[i].skillId === skillId) {
                formDataSkill.splice(i, 1);
            }
        }
        setFormDataSkill([...formDataSkill])

        let dataSelect = { value: skillId, label: label }
        let datas = [...skillList]
        datas.push(dataSelect)
        setSkillList(objectUtil.sortArray(datas, "label"))
    };

    let handleChangeInput = ({ target }) => {
        let { id, value } = target
        let _id = id.split("-")
        let datas = [...formDataSkill]
        let index = datas.findIndex(element => element.skillId.toString() === _id[_id.length - 1].toString())
        datas[index].experience = value
    };

    return (
        <>
            <Col xs={12} sm={12} lg={12} className={"no-padding main-create-skill"}>
                <Row >
                    <Col xs={12} sm={12} lg={12} className={"no-padding header-create-skill"}>
                        <Row>
                            <Col xs={6} sm={6} lg={3} className={"title-text"}>
                                Skill
                            </Col>
                            <Col xs={6} sm={6} lg={9} className={"title-search no-padding"}>
                                <InputSelect xs={12} sm={8} lg={4} id={"skillSelect"} placeholder={"skill"} optionsList={skillList} onChange={handleAddSelect} isSetValue={false} isSearchable={true} />
                            </Col>
                        </Row>
                    </Col>
                    {formDataSkill.map((i) => (
                        <Col key={i.skillId} xs={12} sm={6} lg={3} className={"box-selected no-padding"}>
                            <Input xs={12} sm={12} lg={12} label={i.label} id={`experience-${i.skillId}`} onChange={handleChangeInput} type={"number"} />
                            <i className="fa fa-close" onClick={() => handleDeleteSelect(i)} />
                        </Col>
                    ))}
                    {formDataSkill.length === 0 &&
                        <Col xs={12} sm={12} lg={12} className={`no-data`}>
                            <span>No skill selected.</span>
                        </Col>
                    }
                </Row>
            </Col>
        </>
    );
}

CreateSkill.propTypes = {
    formDataSkill: PropTypes.array,
    skillList: PropTypes.array
};

CreateSkill.defaultProps = {
    formDataSkill: [],
    skillList: []
};

export default CreateSkill;
