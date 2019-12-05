import React from "react";
import * as PropTypes from "prop-types";
import { Row, Col, Dropdown } from "react-bootstrap";
import "./index.scss";

function RowSkill({ data, onClickDelete }) {
    return (
        <Row className={"main-row-skill"}>
            {data.map((i, index) => (
                <Col key={index} xs={12} sm={12} lg={12} className={`row-skill ${(index === data.length - 1) ? "not-border" : ""}`}>
                    <span>{i.skillName}</span>
                    <Row>
                        <Col className={"title-language"} xs={12} sm={12} lg={12}>
                            <div><i className="fa fa-calendar-check-o" /> {i.experience} Year</div>
                        </Col>
                    </Row>

                    <Dropdown>
                        <Dropdown.Toggle bsPrefix=" ">
                            <i className="fa fa-ellipsis-h" />
                        </Dropdown.Toggle>

                        <Dropdown.Menu alignRight>
                            <Dropdown.Item onClick={() => onClickDelete(i)}><i className="fa fa-trash" /> Delete</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
            ))}
            {data.length === 0 &&
                <Col xs={12} sm={12} lg={12} className={`no-data`}>
                    <span>No skill require.</span>
                </Col>
            }
        </Row>
    );
}

RowSkill.propTypes = {
    data: PropTypes.array,
    mode: PropTypes.string,
    onClickDelete: PropTypes.func
};

RowSkill.defaultProps = {
    data: [],
    mode: "customerDetail",
    onClickDelete: () => {
    }
};

export default RowSkill;
