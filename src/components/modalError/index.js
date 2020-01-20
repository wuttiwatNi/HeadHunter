import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom"
import { Modal } from "react-bootstrap";
// action
import { modalErrorAction } from "../../actions";

function ModalError() {
    const history = useHistory()
    const dispatch = useDispatch();
    const modalError = useSelector(state => state.modalError);

    let onClickOk = () => {
        if (modalError.isBack) {
            history.goBack()
        }
        dispatch(modalErrorAction.close())
    }

    return (
        <Modal show={modalError.isShow} onHide={onClickOk}>
            <Modal.Header>
                <Modal.Title as={"h4"}>{"Oop!"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{modalError.des === "" ? "Something went wrong. Please try again later." : modalError.des}</Modal.Body>
            <Modal.Footer>
                <button className={"primary-green outline"} onClick={onClickOk}>Ok</button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalError;
