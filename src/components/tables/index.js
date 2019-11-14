import React, {useState} from "react";
import * as PropTypes from "prop-types";
import {Col, Row, Table} from "react-bootstrap";
import "./index.scss";
import {Link} from "react-router-dom";

function Tables({columnLabel, column, row, pathCreate, onClickCreate}) {
    const [dataList, setDataList] = useState(row);

    let handleChangeSearch = ({target}) => {
        if (target.value.length === 0) {
            setDataList(row)
        } else {
            setDataList(row.filter(data => {
                let result = false;
                Object.keys(data).forEach(key => {
                    if (data[key].toString().indexOf(target.value) > -1) {
                        result = true
                    }
                });
                return result
            }));
        }
    };

    let handleClickRow = (data) => {
        console.log(data)
    };

    return (
        <>
            <Row className={"top-filter"}>
                <Col>
                    <input placeholder={"Search"} onChange={handleChangeSearch}/>
                </Col>
                <Col className={"text-right"}>
                    <Link to={pathCreate} onClick={onClickCreate}>
                        <button className={"outline-primary"}>
                            <i className={"fa fa-plus"}/>
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
                    <tr key={data.id} onClick={() => handleClickRow(data)}>
                        {Object.keys(data).map((key, index) => {
                            if (column.indexOf(key) > -1) {
                                return (<td key={index}>{data[key]}</td>);
                            } else
                                return null;
                        })}
                    </tr>
                ))}
                </tbody>
            </Table>
        </>
    );
}

Tables.propTypes = {
    columnLabel: PropTypes.array.isRequired,
    column: PropTypes.array.isRequired,
    row: PropTypes.array.isRequired,
    pathCreate: PropTypes.string.isRequired,
    onClickCreate: PropTypes.func
    // title: PropTypes.string,
    // body: PropTypes.func
};

Tables.defaultProps = {
    onClickCreate: () => {
    }
};

export default Tables;
