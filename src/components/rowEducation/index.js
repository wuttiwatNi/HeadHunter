import React from "react"
import * as PropTypes from "prop-types"
import { Row, Col } from "react-bootstrap"
import "./index.scss"

function RowEducation({ data }) {
    return (
        <Row className={"main-row-education"}>
            {data.map((i, index) => (
                <Col key={index} xs={12} sm={6} lg={6} className={`row-education ${(index === data.length - 1) ? "not-border" : ""}`}>
                    <span>{i._levelType}</span>
                    <Row>
                        <Col xs={12} sm={12} lg={12}>
                            <div className={"title-level"}><i className="fa fa-university" /> Institute</div>
                            <div className={"des-level"}>{i.instituteName}</div>
                            </Col>
                        <Col xs={12} sm={12} lg={12}>
                            <div className={"title-level"}><i className="fa fa-graduation-cap" /> Major</div>
                            <div className={"des-level"}>{i.major}</div>
                            </Col>
                        <Col xs={6} sm={6} lg={6}>
                            <div className={"title-level"}><i className="fa fa-certificate" /> GPA</div>
                            <div className={"des-level"}>{i.gpa}</div>
                            </Col>
                        <Col xs={6} sm={6} lg={6}>
                            <div className={"title-level"}><i className="fa fa-calendar-check-o" /> Graduate</div>
                            <div className={"des-level"}>{i._graduate}</div>
                        </Col>
                    </Row>
                </Col>
            ))}
            {data.length === 0 &&
                <Col xs={12} sm={12} lg={12} className={`no-data`}>
                    <span>No education.</span>
                </Col>
            }
        </Row>
    )
}

RowEducation.propTypes = {
    data: PropTypes.array
}

RowEducation.defaultProps = {
    data: []
}

export default RowEducation
