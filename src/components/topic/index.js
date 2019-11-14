import React from "react";
import * as PropTypes from "prop-types";
import "./index.scss";

function Topic({title, subTitle}) {
    return (
        <>
            <h4>{title} <small>{subTitle}</small></h4>
        </>
    );
}

Topic.propTypes = {
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string.isRequired
};

export default Topic;
