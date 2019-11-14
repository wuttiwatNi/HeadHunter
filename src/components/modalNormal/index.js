import React from "react";
import * as PropTypes from "prop-types";
import {Modal} from "react-bootstrap";
import "./index.scss";

function ModalNormal({title, description, show, handleClose, handleOk}) {
    return (
        <Modal show={show} onHide={handleClose ? handleClose : handleOk}>
            <Modal.Header>
                <Modal.Title as={"h2"}>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{description}</Modal.Body>
            <Modal.Footer>
                {handleClose && <button className={"primary-red outline"} onClick={handleClose}>Cancel</button>}
                {handleOk && <button className={"primary-green outline"} onClick={handleOk}>Ok </button>}
            </Modal.Footer>
        </Modal>
    );
}

ModalNormal.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleOk: PropTypes.func.isRequired
};

export default ModalNormal;
