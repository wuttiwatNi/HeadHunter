import React from "react"
import * as PropTypes from "prop-types"
import { Row, Col } from "react-bootstrap"
import { objectUtil } from "../../utils/object.util"
// constants
import { generalConstant } from "../../constants/index"
// components
import { InputSelect } from "../../components"
import "./index.scss"

function CreateLanguageSkill({ formDataLanguageSkill, setFormDataLanguageSkill, languageSkillList, setLanguageSkillList, isReset }) {
    let handleAddSelect = ({ target }) => {
        let { value, label } = target
        let data = { languageSkillId: value, listening: "", speaking: "", reading: "", writing: "", languageSkillName: label }
        let datas = [...formDataLanguageSkill]
        datas.push(data)
        setFormDataLanguageSkill(datas)

        for (var i = 0; i < languageSkillList.length; i++) {
            if (languageSkillList[i].value === value) {
                languageSkillList.splice(i, 1)
            }
        }
    }

    let handleDeleteSelect = (data) => {
        let { languageSkillId, languageSkillName } = data

        for (var i = 0; i < formDataLanguageSkill.length; i++) {
            if (formDataLanguageSkill[i].languageSkillId === languageSkillId) {
                formDataLanguageSkill.splice(i, 1)
            }
        }
        setFormDataLanguageSkill(formDataLanguageSkill)

        let dataSelect = { value: languageSkillId, label: languageSkillName }
        let datas = [...languageSkillList]
        datas.push(dataSelect)
        setLanguageSkillList(objectUtil.sortArray(datas, "label"))
    }

    let handleChangeInput = ({ target }) => {
        let { id, value } = target
        let _id = id.split("-")
        let datas = formDataLanguageSkill//JSON.parse(JSON.stringify(formDataLanguageSkill))
        let index = datas.findIndex(element => element.languageSkillId.toString() === _id[_id.length - 1].toString())
        if (_id[0] === "listening") {
            datas[index].listening = value
        }
        if (_id[0] === "speaking") {
            datas[index].speaking = value
        }
        if (_id[0] === "reading") {
            datas[index].reading = value
        }
        if (_id[0] === "writing") {
            datas[index].writing = value
        }
        setFormDataLanguageSkill(datas)
    }

    return (
        <>
            <Col xs={12} sm={12} lg={12} className={"no-padding main-create-language-skill"}>
                <Row >
                    <Col xs={12} sm={12} lg={12} className={"no-padding header-create-language-skill"}>
                        <Row>
                            <Col xs={6} sm={6} lg={3} className={"title-text"}>
                                Language Skill
                            </Col>
                            <Col xs={6} sm={6} lg={9} className={"title-search no-padding"}>
                                <InputSelect xs={12} sm={8} lg={4} id={"languageSkillSelect"} placeholder={"language skill"} optionsList={languageSkillList} onChange={handleAddSelect} isSetValue={false} isSearchable={true} />
                            </Col>
                        </Row>
                    </Col>
                    {formDataLanguageSkill.map((i) => (
                        <Col key={i.languageSkillId} xs={12} sm={12} lg={6} className={"box-selected no-padding"}>
                            <Row>
                                <InputSelect xs={12} sm={6} lg={6} label={i.languageSkillName} id={`listening-${i.languageSkillId}`} placeholder={"listening"} optionsList={generalConstant.levelLanguageList} onChange={handleChangeInput} defaultValue={i.listening} resest={isReset} topic={true} />
                                <InputSelect xs={12} sm={6} lg={6} id={`speaking-${i.languageSkillId}`} placeholder={"speaking"} optionsList={generalConstant.levelLanguageList} onChange={handleChangeInput} isMargin={true} defaultValue={i.speaking} resest={isReset} />
                                <InputSelect xs={12} sm={6} lg={6} id={`reading-${i.languageSkillId}`} placeholder={"reading"} optionsList={generalConstant.levelLanguageList} onChange={handleChangeInput} defaultValue={i.reading} resest={isReset} />
                                <InputSelect xs={12} sm={6} lg={6} id={`writing-${i.languageSkillId}`} placeholder={"writing"} optionsList={generalConstant.levelLanguageList} onChange={handleChangeInput} defaultValue={i.writing} resest={isReset} />
                            </Row>
                            <i className="fa fa-close" onClick={() => handleDeleteSelect(i)} />
                        </Col>
                    ))}
                    {formDataLanguageSkill.length === 0 &&
                        <Col xs={12} sm={12} lg={12} className={`no-data`}>
                            <span>No language skill selected.</span>
                        </Col>
                    }
                </Row>
            </Col>
        </>
    )
}

CreateLanguageSkill.propTypes = {
    formDataLanguageSkill: PropTypes.array,
    languageSkillList: PropTypes.array
}

CreateLanguageSkill.defaultProps = {
    formDataLanguageSkill: [],
    languageSkillList: []
}

export default CreateLanguageSkill
