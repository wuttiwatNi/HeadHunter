import React from "react";
import * as PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import "./index.scss";

function ModalForm({ title, subTitle, show, handleClose, handleOk, form, isButtonOk }) {
    return (
        <Modal show={show} className={"modal-form"} onHide={handleClose ? handleClose : handleOk}>
            {title &&
                <Modal.Header>
                    <Modal.Title as={"h4"}>{title} <small>{subTitle}</small></Modal.Title>
                </Modal.Header>
            }
            <Modal.Body>{form()}</Modal.Body>
            <Modal.Footer>
                {(handleClose && !isButtonOk) && <button className={"primary-gray outline"} onClick={handleClose}>Cancel</button>}
                {(handleOk && !isButtonOk) && <button className={"primary-green outline"} onClick={handleOk}>Submit </button>}
                {(isButtonOk) && <button className={"primary-green outline"} onClick={handleClose}>Ok</button>}
            </Modal.Footer>
        </Modal>
    );
}

ModalForm.propTypes = {
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string,
    show: PropTypes.bool.isRequired,
    form: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleOk: PropTypes.func,
    isButtonOk: PropTypes.bool
};

ModalForm.defaultProps = {
    isButtonOk: false,
    form: () => {
    }
};

export default ModalForm;
