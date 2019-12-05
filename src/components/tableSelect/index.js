import React, { useState, useEffect } from "react";
import * as PropTypes from "prop-types";
import { Table } from "react-bootstrap";
import "./index.scss";

function TableSelect({ column, row, onClickRow }) {
    const [dataList, setDataList] = useState([]);

    useEffect(() => {
        if (row !== undefined) {
            setDataList(row)
        }
    }, [setDataList, row]);

    let _onClickRow = (data) => {
        dataList.forEach((element) => {
            document.getElementById(`table-select-row-${element.id}`).classList.remove("select")
        })
        document.getElementById(`table-select-row-${data.id}`).classList.add("select")
        onClickRow(data)
    }

    return (
        <>
            <Table className={"table-select"} responsive >
                <tbody>
                    {/* Row */}
                    {dataList.map(data => (
                        <tr key={data.id} onClick={() => _onClickRow(data)} id={`table-select-row-${data.id}`} title={"select"}>
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

TableSelect.propTypes = {
    column: PropTypes.array.isRequired,
    // row: PropTypes.array.isRequired,
    onClickRow: PropTypes.func
};

TableSelect.defaultProps = {
    onClickRow: () => {
    }
};

export default TableSelect;
