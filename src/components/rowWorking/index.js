import React from "react"
import * as PropTypes from "prop-types"
import { Row, Col } from "react-bootstrap"
import "./index.scss"

function RowWorking({ data }) {
    return (
        <Row className={"main-row-working"}>
            {data.map((i, index) => (
                <Col key={index} xs={12} sm={6} lg={6} className={`row-working ${(index === data.length - 1) ? "not-border" : ""}`}>
                    <span>{i.companyName}</span> ({i.calYearWorking})
                    <Row>
                        <Col xs={6} sm={6} lg={6}>
                            <div className={"title-level"}>Category</div>
                            <div className={"des-level"}>{i.positionCategoryName}</div>
                        </Col>
                        <Col xs={6} sm={6} lg={6}>
                            <div className={"title-level"}>Position</div>
                            <div className={"des-level"}>{i.positionName}</div>
                        </Col>
                        <Col xs={12} sm={12} lg={12}>
                            <div className={"title-level"}><i className="fa fa-calendar" /> Start-Date</div>
                            <div className={"des-level"}>{i._startDate} - {i._endDate}</div>
                        </Col>
                        <Col xs={6} sm={6} lg={6}>
                            <div className={"title-level"}><i className="fa fa-money" /> Salary</div>
                            <div className={"des-level"}>{i._salary} ฿</div>
                        </Col>
                        <Col xs={12} sm={12} lg={12}>
                            <div className={"title-level"}><i className="fa fa-money" /> Bonus</div>
                            <div className={"des-level"}>{i.calBonus} ฿ ({i.bonus} month)</div>
                        </Col>
                        <Col xs={12} sm={12} lg={12}>
                            <div className={"title-level"}><i className="fa fa-comment" /> Reason</div>
                            <div className={"des-level"}>{i.reason}</div>
                        </Col>
                    </Row>
                </Col>
            ))}
            {data.length === 0 &&
                <Col xs={12} sm={12} lg={12} className={`no-data`}>
                    <span>No history working.</span>
                </Col>
            }
        </Row>
    )
}

RowWorking.propTypes = {
    data: PropTypes.array
}

RowWorking.defaultProps = {
    data: []
}

export default RowWorking
