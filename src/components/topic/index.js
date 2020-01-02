import React from "react";
import * as PropTypes from "prop-types";
import "./index.scss";

function Topic({ title, subTitle, onClickDelete }) {
    return (
        <>
            <h4>{title} <small className={title.length > 10 ? "responsive" : ""}>{subTitle}</small>
                {onClickDelete && <span className={"bar-delete"} onClick={onClickDelete}><i className="fa fa-trash" /> Delete</span>}
            </h4>
        </>
    );
}

Topic.propTypes = {
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string.isRequired,
    onClickDelete: PropTypes.func
};

export default Topic;
