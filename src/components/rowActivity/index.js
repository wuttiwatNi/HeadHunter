import React from "react"
import * as PropTypes from "prop-types"
import { objectUtil } from "../../utils/object.util"
import { Row, Col } from "react-bootstrap"
import { format } from "date-fns"
import "./index.scss"

function RowActivity({ data, onClickDelete, onClickEdit, isOrder }) {
    return (
        <Row className={"main-row-activity"}>
            {data.length !== 0 &&
                <ul className="timeline">
                    {data.map((i) => (
                        <div key={i.id}>
                            {
                                i.isSameDay &&
                                <li className="time-label">
                                    <span className={`bg-${objectUtil.mapDayColor(format(new Date(i._createdDate), "EEEEEE"))}`}>{i.createdDate}</span>
                                </li>
                            }
                            <li>
                                <i className={`fa fa-${objectUtil.mapActivityTypeIcon(i.activityTypeId)} header bg-${objectUtil.mapActivityTypeColor(i.activityTypeId)}`}></i>
                                <div className="timeline-item">
                                    <span className="time"><i className="fa fa-clock-o"></i> {i.createdTime}</span>
                                    <h3 className="timeline-header"><span>{objectUtil.mapActivityTypeId(i.activityTypeId)}</span>
                                        {i.orderId && `(${isOrder ? `${i.candidateFirstName} ${i.candidateLastName}` : `${i.companyName} : ${i.positionName}`} ${i.salary ? `: ${i.salary.toLocaleString()}฿` : ""})`}
                                    </h3>
                                    <div className="timeline-body">
                                        {i.activityNote}
                                        <span>{i.createdByFirstName} {i.createdByLastName}</span>
                                    </div>
                                    <div className="timeline-footer">
                                        <button className="outline-primary-blue" onClick={() => onClickEdit(i)} style={{ marginRight: 10 }}>Edit</button>
                                        <button className="outline-primary-red" onClick={() => onClickDelete(i)}>Delete</button>
                                    </div>
                                </div>
                            </li>
                        </div>
                    ))}
                    <li>
                        <i className="fa fa-clock-o header" style={{ color: "#666" }}></i>
                    </li>
                </ul>
            }
            {data.length === 0 &&
                <Col xs={12} sm={12} lg={12} className={`no-data`}>
                    <span>No activity.</span>
                </Col>
            }
        </Row>
    )
}

RowActivity.propTypes = {
    data: PropTypes.array,
    isOrder: PropTypes.bool
}

RowActivity.defaultProps = {
    data: [],
    isOrder: false
}

export default RowActivity