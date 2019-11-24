import React from "react";
import * as PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import "./index.scss";

function ModalNormal({ title, description, show, handleClose, handleOk, swapColor }) {
    return (
        <Modal show={show} onHide={handleClose ? handleClose : handleOk}>
            {title &&
                <Modal.Header>
                    <Modal.Title as={"h4"}>{title}</Modal.Title>
                </Modal.Header>
            }
            {description &&
                <Modal.Body>{description}</Modal.Body>
            }
            <Modal.Footer>
                {handleClose && <button className={`${swapColor ? "primary-green" : "primary-gray"} outline`} onClick={handleClose}>Cancel</button>}
                {handleOk && <button className={`${swapColor ? "primary-gray" : "primary-green"} outline`} onClick={handleOk}>Ok </button>}
            </Modal.Footer>
        </Modal>
    );
}

ModalNormal.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleOk: PropTypes.func.isRequired,
    swapColor: PropTypes.bool
};

ModalNormal.defaultProps = {
    swapColor: false
};

export default ModalNormal;
