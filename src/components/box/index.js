import React from "react";
import * as PropTypes from "prop-types";
import {Col} from "react-bootstrap";
import "./index.scss";

function Box({xs = 12, sm = 12, lg = 12, title = "", body, footer}) {
    return (
        <Col xs={xs} sm={sm} lg={lg}>
            <div className={"box"}>
                {
                    title &&
                    <div className="box-header">
                        <h3 className="box-title">{title}</h3>
                    </div>
                }
                <div className="box-body">
                    {body()}
                </div>
                {
                    footer() &&
                    <div className="box-footer">
                        {footer()}
                    </div>
                }
            </div>
        </Col>
    );
}

Box.propTypes = {
    xs: PropTypes.number,
    sm: PropTypes.number,
    lg: PropTypes.number,
    title: PropTypes.string,
    body: PropTypes.func
};

Box.defaultProps = {
    body: () => {
    },
    footer: () => {
    }
};

export default Box;
