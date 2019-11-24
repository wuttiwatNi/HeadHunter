import React from "react";
import { useSelector } from "react-redux";
import { Modal, Spinner } from "react-bootstrap";
import "./index.scss";

function ModalLoading() {
    const modalLoading = useSelector(state => state.modalLoading);

    return (
        <Modal show={modalLoading.isShow} className="modal-loading">
            <Spinner animation="grow" variant="primary" />
        </Modal>
    );
}

export default ModalLoading;
