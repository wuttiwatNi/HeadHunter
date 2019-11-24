import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
// action
import { modalErrorAction } from "../../actions";

function ModalError() {
    const dispatch = useDispatch();
    const modalError = useSelector(state => state.modalError);

    return (
        <Modal show={modalError.isShow} onHide={() => dispatch(modalErrorAction.close())}>
            <Modal.Header>
                <Modal.Title as={"h4"}>{"Oop!"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{"Something went wrong. Please try again later."}</Modal.Body>
            <Modal.Footer>
                <button className={"primary-green outline"} onClick={() => dispatch(modalErrorAction.close())}>Ok</button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalError;
