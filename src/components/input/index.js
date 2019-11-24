import React from "react";
import * as PropTypes from "prop-types";
import { Col } from "react-bootstrap";
import "./index.scss";

function Input({ xs, sm, lg, label, id, onChange, type, isHidden, defaultValue }) {
    let onChanges = (data) => {
        document.getElementById(data.target.id).classList.remove("invalid")
        onChange(data)
    }

    return (
        <Col xs={xs} sm={sm} lg={lg} className={`input ${isHidden ? "hidden" : ""}`}>
            <span>{label}</span>
            {type !== "textarea" ?
                <input id={id} onChange={onChanges} type={type} defaultValue={defaultValue} required /> :
                <textarea id={id} onChange={onChanges} style={{ height: 112 }} />
            }
        </Col>
    );
}

Input.propTypes = {
    xs: PropTypes.number,
    sm: PropTypes.number,
    lg: PropTypes.number,
    label: PropTypes.string,
    id: PropTypes.string,
    onChange: PropTypes.func,
    type: PropTypes.string
};

Input.defaultProps = {
    xs: 12,
    sm: 12,
    lg: 12,
    label: "",
    id: "",
    onChange: () => {
    },
    type: "text"
};

export default Input;
