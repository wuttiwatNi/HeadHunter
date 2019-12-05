import React, { useState, useEffect } from "react";
import * as PropTypes from "prop-types";
import { Col } from "react-bootstrap";
import "./index.scss";

function Input({ xs, sm, lg, label, id, onChange, type, isHidden, defaultValue, resest, unit }) {
    const [value, setValue] = useState("");
    const [checkSetDefault, setCheckSetDefault] = useState(false);

    useEffect(() => {
        if (defaultValue !== undefined && !checkSetDefault) {
            setCheckSetDefault(true)
            setValue(defaultValue)
        } else if (resest) {
            setValue(defaultValue)
        }
    }, [checkSetDefault, setCheckSetDefault, setValue, defaultValue, resest]);

    let onChanges = (data) => {
        document.getElementById(data.target.id).classList.remove("invalid")
        setValue(data.target.value)
        onChange(data)
    }

    return (
        <Col xs={xs} sm={sm} lg={lg} className={`input ${isHidden ? "hidden" : ""}`}>
            <span>{label}</span>
            <div className="main-input">
                {type !== "textarea" ?
                    <input id={id} onChange={onChanges} type={type} value={value} required /> :
                    <textarea id={id} onChange={onChanges} value={value} style={{ height: 112 }} />
                }
                {unit && <div className="unit" title={unit}>{unit}</div>}
            </div>
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
