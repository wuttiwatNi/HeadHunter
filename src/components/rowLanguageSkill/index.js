import React from "react"
import * as PropTypes from "prop-types"
import { Row, Col } from "react-bootstrap"
import "./index.scss"

function RowLanguageSkill({ data }) {
    return (
        <Row className={"main-row-skill"}>
            {data.map((i, index) => (
                <Col key={index} xs={12} sm={12} lg={12} className={`row-skill ${(index === data.length - 1) ? "not-border" : ""}`}>
                    <span>{i.languageSkillName}</span>
                    <Row>
                        <Col xs={6} sm={6} lg={6}>
                            <div className={"title-level"}><i className="fa fa-assistive-listening-systems" /> Listening</div>
                            <div className={"des-level"}>{i.listeningName}</div>
                        </Col>
                        <Col xs={6} sm={6} lg={6}>
                            <div className={"title-level"}><i className="fa fa-volume-up" /> Speaking</div>
                            <div className={"des-level"}>{i.speakingName}</div>
                        </Col>
                        <Col xs={6} sm={6} lg={6}>
                            <div className={"title-level"}><i className="fa fa-book" /> Reading</div>
                            <div className={"des-level"}>{i.readingName}</div>
                        </Col>
                        <Col xs={6} sm={6} lg={6}>
                            <div className={"title-level"}><i className="fa fa-pencil-square-o" /> Writing</div>
                            <div className={"des-level"}>{i.writingName}</div>
                        </Col>
                    </Row>

                    {/* <Dropdown>
                        <Dropdown.Toggle bsPrefix=" ">
                            <i className="fa fa-ellipsis-h" />
                        </Dropdown.Toggle>

                        <Dropdown.Menu alignRight>
                            <Dropdown.Item onClick={() => onClickDelete(i)}><i className="fa fa-trash" /> Delete</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown> */}
                </Col>
            ))}
            {data.length === 0 &&
                <Col xs={12} sm={12} lg={12} className={`no-data`}>
                    <span>No skill require.</span>
                </Col>
            }
        </Row>
    )
}

RowLanguageSkill.propTypes = {
    data: PropTypes.array,
    // onClickDelete: PropTypes.func
}

RowLanguageSkill.defaultProps = {
    data: [],
    // onClickDelete: () => {
    // }
}

export default RowLanguageSkill
