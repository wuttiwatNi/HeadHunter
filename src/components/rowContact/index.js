import React from "react";
import * as PropTypes from "prop-types";
import { Row, Col, Dropdown } from "react-bootstrap";
import "./index.scss";

function RowContact({ data, onClickEdit, onClickDelete, mode }) {
    return (
        <Row className={"main-row-contact"}>
            {data.map((i, index) => (
                <Col key={i.id} xs={12} sm={12} lg={12} className={`row-contact ${(index === data.length - 1) ? "not-border" : ""}`}>
                    <span>{i.firstName} {i.lastName}</span>
                    <div><i className="fa fa-envelope-square" /> {i.email}</div>
                    <div><i className="fa fa-phone-square" /> {i.phoneNumber}</div>

                    <Dropdown>
                        <Dropdown.Toggle bsPrefix=" ">
                            <i className="fa fa-ellipsis-h" />
                        </Dropdown.Toggle>

                        <Dropdown.Menu alignRight>
                            <Dropdown.Item onClick={() => onClickEdit(i)}><i className="fa fa-pencil" /> Edit</Dropdown.Item>
                            {mode === "customerDetail" && <Dropdown.Item onClick={() => onClickDelete(i)}><i className="fa fa-trash" /> Delete</Dropdown.Item>}
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
            ))}
            {data.length === 0 &&
                <Col xs={12} sm={12} lg={12} className={`no-data`}>
                    <span>No data contact.</span>
                </Col>
            }
        </Row>
    );
}

RowContact.propTypes = {
    data: PropTypes.array,
    mode: PropTypes.string,
    onClickDelete: PropTypes.func
};

RowContact.defaultProps = {
    data: [],
    mode: "customerDetail",
    onClickDelete: () => {
    }
};

export default RowContact;
