import React from "react";
import * as PropTypes from "prop-types";
import { Row, Col } from "react-bootstrap";
import "./index.scss";

function Box({ xs, sm, lg, title, body, footer, icon, onClickIcon }) {
    return (
        <Col xs={xs} sm={sm} lg={lg}>
            <div className={"box"}>
                {
                    title &&
                    <Row className={"box-header"}>
                        <Col><h3>{title}</h3></Col>
                        {
                            icon && <Col className={"text-right"}>
                                <button className={"outline-primary"} onClick={onClickIcon}>
                                    <i className={`fa ${icon}`} />
                                </button>
                            </Col>
                        }
                    </Row>
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
    body: PropTypes.func,
    onClickIcon: PropTypes.func
};

Box.defaultProps = {
    xs: 12,
    sm: 12,
    lg: 12,
    title: "",
    body: () => {
    },
    footer: () => {
    },
    onClickIcon: () => {
    }
};

export default Box;
