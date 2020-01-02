import React from "react";
import * as PropTypes from "prop-types";
import { Row, Col } from "react-bootstrap";
import "./index.scss";

function Informaiton({ data, keyValue }) {
    return (
        <Row>
            {keyValue.map((i, index) => (
                <Col key={index} xs={i.full ? 12 : 6} sm={i.full ? 12 : 6} lg={i.full ? 12 : 6} className={"information"}>
                    <span>{i.label}</span>
                    <div>{data[i.key]}</div> {/* style={{ whiteSpace: "pre" }} */}
                </Col>
            ))}
        </Row>
    );
}

Informaiton.propTypes = {
    data: PropTypes.object,
    keyValue: PropTypes.array
};

Informaiton.defaultProps = {
    data: {},
    keyValue: []
};

export default Informaiton;
