import React from "react"
import * as PropTypes from "prop-types"
import { Row, Col } from "react-bootstrap"
import "./index.scss"

function Matching({ dataOrder, dataCandidate }) {
    return (
        <Row className={"main-row-matching"}>
            <Col xs={12} sm={12} lg={12} >
                <span className={"topic"}>Position <span className={"percent"}>{dataCandidate.percentPosition}%</span></span>
            </Col>
            <Col xs={6} sm={6} lg={6} className={`${
                (
                    dataOrder.positionName === dataCandidate.positionAppliedFirstName ||
                    dataOrder.positionName === dataCandidate.positionAppliedSecondName
                ) ? "green" : "red"}`
            }>
                {dataOrder.positionName}
            </Col>
            <Col xs={6} sm={6} lg={6} className={`${
                (
                    dataCandidate.positionAppliedFirstName === dataOrder.positionName
                ) ? "green" : "default"}`
            }>
                {dataCandidate.positionAppliedFirstName}
            </Col>
            <Col xs={6} sm={6} lg={6} />
            <Col xs={6} sm={6} lg={6} className={`${
                (
                    dataCandidate.positionAppliedSecondName === dataOrder.positionName
                ) ? "green" : "default"}`
            }>
                {dataCandidate.positionAppliedSecondName}
            </Col>

            <Col xs={12} sm={12} lg={12} >
                <span className={"topic"}>Experience <span className={"percent"}>{dataCandidate.percentExperience}%</span></span>
            </Col>
            <Col xs={6} sm={6} lg={6} className={`${
                (
                    dataOrder.experience <= dataCandidate.sumExperience
                ) ? "green" : "red"}`
            }>
                {dataOrder.experience} Year
            </Col>
            <Col xs={6} sm={6} lg={6} className={`${
                (
                    dataOrder.experience <= dataCandidate.sumExperience
                ) ? "green" : "red"}`
            }>
                {dataCandidate.sumExperience} Year
            </Col>

            <Col xs={12} sm={12} lg={12} >
                <span className={"topic"}>Budget <span className={"percent"}>{dataCandidate.percentBudget}%</span></span>
            </Col>
            <Col xs={6} sm={6} lg={6} className={`${
                (
                    dataOrder.budget >= dataCandidate.salaryExpect
                ) ? "green" : "red"}`
            }>
                {dataOrder.budget.toLocaleString()} ฿
            </Col>
            <Col xs={6} sm={6} lg={6} className={`${
                (
                    dataOrder.budget >= dataCandidate.salaryExpect
                ) ? "green" : "red"}`
            }>
                {dataCandidate.salaryExpect.toLocaleString()} ฿
            </Col>

            <Col xs={12} sm={12} lg={12} >
                <span className={"topic"}>LanguageSkill <span className={"percent"}>{dataCandidate.percentLanguageSkill}%</span></span>
            </Col>
            <Col xs={6} sm={6} lg={6} className={"no-padding"}>
                <Row>
                    {dataOrder["languageSkill"].map((i) => (
                        <Col key={i.id} xs={12} sm={12} lg={12} className={`${
                            dataCandidate.languageSkill.find(e => e.languageSkillName === i.languageSkillName)
                                ? "green" : "red"}`
                        }>
                            {i.languageSkillName}
                        </Col>
                    ))}
                </Row>
            </Col>
            <Col xs={6} sm={6} lg={6} className={"no-padding"}>
                <Row>
                    {dataCandidate["languageSkill"].map((i) => (
                        <Col key={i.id} xs={12} sm={12} lg={12} className={`${
                            dataOrder.languageSkill.find(e => e.languageSkillName === i.languageSkillName)
                                ? "green" : "default"}`
                        }>
                            {i.languageSkillName}
                        </Col>
                    ))}
                </Row>
            </Col>

            <Col xs={12} sm={12} lg={12} >
                <span className={"topic"}>Skill <span className={"percent"}>{dataCandidate.percentSkill}%</span></span>
            </Col>
            <Col xs={6} sm={6} lg={6} className={"no-padding"}>
                <Row>
                    {dataOrder["skill"].map((i) => (
                        <Col key={i.id} xs={12} sm={12} lg={12} className={`${
                            dataCandidate.skill.find(e => e.skillName === i.skillName)
                                ? "green" : "red"}`
                        }>
                            {i.skillName}
                        </Col>
                    ))}
                </Row>
            </Col>
            <Col xs={6} sm={6} lg={6} className={"no-padding"}>
                <Row>
                    {dataCandidate["skill"].map((i) => (
                        <Col key={i.id} xs={12} sm={12} lg={12} className={`${
                            dataOrder.skill.find(e => e.skillName === i.skillName)
                                ? "green" : "default"}`
                        }>
                            {i.skillName}
                        </Col>
                    ))}
                </Row>
            </Col>

            <Col xs={12} sm={12} lg={12} style={{textAlign: "center"}} >
                <span className={`sum ${dataCandidate["matching"] >= 70 ? "green" : dataCandidate["matching"] >= 50 ? "yellow" : "red"}`}>Sum {dataCandidate.matching}%</span>
            </Col>
        </Row >
    )
}

Matching.propTypes = {
    dataOrder: PropTypes.object
}

Matching.defaultProps = {
    dataOrder: {}
}

export default Matching
