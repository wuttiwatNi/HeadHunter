import React, { useState, useEffect } from "react";
import * as PropTypes from "prop-types";
import { Col, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./index.scss";

function Tables({ columnLabel, column, row, pathCreate, onClickRow, onClickCreate }) {
    const [dataList, setDataList] = useState([]);
    const [check, setCheck] = useState(0);

    useEffect(() => {
        if (row !== undefined && check === 0) {
            setDataList(row)
        }
    }, [setDataList, row, check]);

    let handleChangeSearch = ({ target }) => {
        setCheck(target.value.length)
        if (target.value.length !== 0) {
            setDataList(row.filter(data => {
                let result = false;
                Object.keys(data).forEach(key => {
                    if ((data[key] + "").toString().toLowerCase().indexOf(target.value.toLowerCase()) > -1) {
                        result = true
                    }
                });
                return result
            }));
        }
    };

    let handleChildClick = (e) => {
        // e.stopPropagation();
    }

    return (
        <>
            <Row className={"top-filter"}>
                <Col>
                    <input placeholder={"Search"} onChange={handleChangeSearch} />
                </Col>
                <Col className={"text-right"}>
                    <Link to={pathCreate} onClick={onClickCreate}>
                        <button className={"outline-primary"}>
                            <i className={"fa fa-plus"} />
                        </button>
                    </Link>
                </Col>
            </Row>
            <Table striped responsive hover>
                <thead>
                    <tr>
                        {/* Column */}
                        {columnLabel.map((data, index) => (
                            <th key={index}>{data}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {/* Row */}
                    {dataList.map(data => (
                        <tr key={data.id} onClick={() => onClickRow(data)}>
                            {column.map((key, index) => {
                                return (<td key={index}><span onClick={handleChildClick}>{data[key]}</span></td>);
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
    );
}

Tables.propTypes = {
    columnLabel: PropTypes.array.isRequired,
    column: PropTypes.array.isRequired,
    pathCreate: PropTypes.string.isRequired,
    onClickCreate: PropTypes.func,
    onClickRow: PropTypes.func
};

Tables.defaultProps = {
    onClickCreate: () => {
    },
    onClickRow: () => {
    }
};

export default Tables;
