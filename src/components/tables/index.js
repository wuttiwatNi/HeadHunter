import React, { useState, useEffect } from "react"
import * as PropTypes from "prop-types"
import { Col, Row, Table } from "react-bootstrap"
import { Link } from "react-router-dom"
import "./index.scss"

function Tables({ columnLabel, column, row, pathCreate, onClickRow, onClickCreate, onClickResetPassword, onClickDelete, onClickShowMatching }) {
    const [dataList, setDataList] = useState([])
    const [check, setCheck] = useState(0)

    useEffect(() => {
        if (row !== undefined && check === 0) {
            setDataList(row)
        }
    }, [setDataList, row, check])

    let handleChangeSearch = ({ target }) => {
        setCheck(target.value.length)
        if (target.value.length !== 0) {
            setDataList(row.filter(data => {
                let result = false
                Object.keys(data).forEach(key => {
                    if ((data[key] + "").toString().toLowerCase().indexOf(target.value.toLowerCase()) > -1) {
                        result = true
                    }
                })
                return result
            }))
        }
    }

    let handleChildClickShowMatching = (e, data) => {
        e.stopPropagation()
        onClickShowMatching(data)
    }

    let handleChildClickResetPassword = (e, data) => {
        e.stopPropagation()
        onClickResetPassword(data)
    }

    let handleChildClickDelete = (e, data) => {
        e.stopPropagation()
        onClickDelete(data)
    }

    return (
        <>
            <Row className={"top-filter"}>
                <Col>
                    <input placeholder={"Search"} onChange={handleChangeSearch} />
                </Col>
                <Col className={"text-right"}>
                    {pathCreate &&
                        <Link to={pathCreate} onClick={onClickCreate}>
                            <button className={"outline-primary"}>
                                <i className={"fa fa-plus"} />
                            </button>
                        </Link>
                    }
                </Col>
            </Row>
            <Table responsive >
                {/* striped hover */}
                <thead>
                    <tr>
                        {/* Column */}
                        {columnLabel.map((data, index) => {
                            if (data === "Appropriate" || data === "Priority") {
                                return <th key={index} style={{ textAlign: "center" }}>{data}</th>
                            } else {
                                return <th key={index}>{data}</th>
                            }
                        })}
                    </tr>
                </thead>
                <tbody>
                    {/* Row */}
                    {dataList.map(data => (
                        <tr key={data.id} onClick={() => onClickRow(data)}>
                            {column.map((key, index) => {
                                if (key === "menu")
                                    return (<td key={index} style={{ textAlign: "center", minWidth: 230 }}>
                                        <button className="outline-primary-blue" onClick={(e) => handleChildClickResetPassword(e, data)} style={{ marginRight: 10 }}>Reset Password</button>
                                        <button className="outline-primary-red" onClick={(e) => handleChildClickDelete(e, data)}>Delete</button>
                                    </td>)
                                else if (key === "matching")
                                    return (<td key={index} style={{ textAlign: "center" }}>
                                        <span className={`matching ${data[key] >= 70 ? "green" : data[key] >= 50 ? "yellow" : "red"}`} onClick={(e) => handleChildClickShowMatching(e, data)}>{data[key]}%</span>
                                    </td>)
                                else if (key === "priorityName")
                                    return (<td key={index} style={{ textAlign: "center" }}>
                                        <span className={`matching ${data["priority"] === 3 ? "green" : data["priority"] === 2 ? "yellow" : "red"}`}>{data[key]}</span>
                                    </td>)
                                else
                                    return (<td key={index}><span>{data[key]}</span></td>)
                            })}
                        </tr>
                    ))}
                </tbody>
            </Table>
            {dataList.length === 0 &&
                <Col xs={12} sm={12} lg={12} className={`no-data-table`}>
                    <span>No data table.</span>
                </Col>
            }
        </>
    )
}

Tables.propTypes = {
    columnLabel: PropTypes.array.isRequired,
    column: PropTypes.array.isRequired,
    pathCreate: PropTypes.string.isRequired,
    onClickCreate: PropTypes.func,
    onClickRow: PropTypes.func
}

Tables.defaultProps = {
    onClickCreate: () => {
    },
    onClickRow: () => {
    }
}

export default Tables
