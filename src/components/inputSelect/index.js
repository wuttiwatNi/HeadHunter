import React, { useState } from "react";
import * as PropTypes from "prop-types";
import Select from "react-select";
import { Col } from "react-bootstrap";
import "./index.scss";

function InputSelect({ xs, sm, lg, label, id, optionsList, onChange, isSearchable, isDisabled, isLoading }) {
    const [value, setValue] = useState(false);

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

    let clear = (data) => {
        setValue(null)
    }

    return (
        <Col xs={xs} sm={sm} lg={lg} className={"input"}>
            <span>{label}</span>
            <Select
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
