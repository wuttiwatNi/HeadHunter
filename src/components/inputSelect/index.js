import React, { useState, useEffect } from "react";
import * as PropTypes from "prop-types";
import Select from "react-select";
import { Col } from "react-bootstrap";
import "./index.scss";

function InputSelect({ xs, sm, lg, label, id, optionsList, onChange, isSearchable, isDisabled, isLoading, defaultValue, resest }) {
    const [value, setValue] = useState(null);
    const [checkSetDefault, setCheckSetDefault] = useState(false);

    useEffect(() => {
        if (defaultValue !== undefined && !checkSetDefault) {
            let _defaultSelect = optionsList.find((element) => {
                return element.value.toString() === defaultValue.toString()
            })
            if (_defaultSelect !== undefined) {
                setCheckSetDefault(true)
                setValue(_defaultSelect)
            }
        } else if (resest) {
            let _defaultSelect = optionsList.find((element) => {
                return element.value.toString() === defaultValue.toString()
            })
            if (_defaultSelect !== undefined) {
                setCheckSetDefault(true)
                setValue(_defaultSelect)
            }
        }
    }, [checkSetDefault, setCheckSetDefault, setValue, defaultValue, optionsList, resest]);

    let onChanges = (data) => {
        setValue(data)
        let result = {
            target: {}
        };
        result.target["id"] = id
        result.target["value"] = data != null ? data["value"] : ""
        document.getElementById(id).classList.remove("invalid")
        onChange(result)
    }

    let clear = () => {
        setValue(null)
    }

    return (
        <Col xs={xs} sm={sm} lg={lg} className={"input"}>
            <span>{label}</span>
            <Select
                // defaultValue={defaultSelect}
                value={value}
                isSearchable={isSearchable}
                isDisabled={isDisabled}
                isLoading={isLoading}
                id={id}
                placeholder={`Choose ${label.toLowerCase()}`}
                isClearable={true}
                options={optionsList}
                onChange={onChanges}
            />
            <button id={`clear-select-${id}`} style={{ display: "none" }} onClick={clear} />
        </Col>
    );
}

InputSelect.propTypes = {
    xs: PropTypes.number,
    sm: PropTypes.number,
    lg: PropTypes.number,
    label: PropTypes.string,
    id: PropTypes.string,
    optionsList: PropTypes.array,
    onChange: PropTypes.func,
    isSearchable: PropTypes.bool,
    isDisabled: PropTypes.bool,
    isLoading: PropTypes.bool
};

InputSelect.defaultProps = {
    xs: 12,
    sm: 12,
    lg: 12,
    label: "",
    id: "",
    optionsList: [],
    onChange: () => {
    },
    isSearchable: false,
    isDisabled: false,
    isLoading: false
};

export default InputSelect;
