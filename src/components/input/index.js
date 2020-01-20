import React, { useState, useEffect } from "react"
import * as PropTypes from "prop-types"
import { Col } from "react-bootstrap"
// import _ from "lodash"
import "./index.scss"

function Input({ xs, sm, lg, label, id, onChange, type, isHidden, defaultValue, defaultNameFile, resest, unit, isMargin, typeFile, warning, topic, isDisabled }) {
    const [value, setValue] = useState("")
    const [checkSetDefault, setCheckSetDefault] = useState(false)

    useEffect(() => {
        if (defaultValue !== undefined && !checkSetDefault) {
            setCheckSetDefault(true)
            if (type !== "file") {
                setValue(defaultValue)
            }
        } else if (resest) {
            if (type !== "file") {
                setValue(defaultValue)
            }
        }
    }, [checkSetDefault, setCheckSetDefault, setValue, defaultValue, resest, type]);

    let onChanges = (data) => {
        document.getElementById(data.target.id).classList.remove("invalid")
        if (type === "checkbox") {
            setValue(!Boolean(value))
        } else {
            setValue(data.target.value)
        }
        onChange(data)
    }

    let handleChildClick = (e) => {
        document.getElementById(id).click()
    }

    return (
        <Col xs={xs} sm={sm} lg={lg} className={`input ${isHidden ? "hidden" : ""}`} style={{ paddingTop: isMargin ? 26 : 0 }}>
            <div className="label">
                {type !== "checkbox" && <><span className={topic ? "topic" : ""}>{label}</span> {warning && <span className={"warning"}>({warning})</span>}</>}
            </div>
            <div className="main-input" style={{ position: `${type === "file" ? "relative" : ""}` }}>
                {type === "textarea" ?
                    <textarea id={id} onChange={onChanges} value={value} style={{ height: 120 }} /> :
                    type === "file" ?
                        <input id={id} onChange={onChanges} type={type} value={value} required accept={typeFile} /> :
                        <input id={id} onChange={onChanges} type={type} value={value} required checked={Boolean(value)} className={unit ? "not-full" : ""} disabled={isDisabled} />
                } {type === "checkbox" && <span className={"span-checkbox"}>{label}</span>}
                {unit && <div className="unit" title={unit}>{unit}</div>}
                {(type === "file" && value === "") && <span className={"file-name"} onClick={handleChildClick}>{defaultNameFile}</span>}
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
    type: PropTypes.string,
    isMargin: PropTypes.bool,
    typeFile: PropTypes.string,
    isDisabled: PropTypes.bool
};

Input.defaultProps = {
    xs: 12,
    sm: 12,
    lg: 12,
    label: "",
    id: "",
    onChange: () => {
    },
    type: "text",
    isMargin: false,
    typeFile: "",
    isDisabled: false
};

export default Input;
