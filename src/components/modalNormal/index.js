import React from 'react';
import {Modal} from 'react-bootstrap';
import './index.scss'

function ModalNormal({title, description, show, handleClose, handleOk}) {
    return (
        <Modal show={show} onHide={handleClose ? handleClose : handleOk}>
            <Modal.Header>
                <Modal.Title as={'h2'}>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{description}</Modal.Body>
            <Modal.Footer>
                {handleClose && <button className={'primary-red outline'} onClick={handleClose}>Cancel</button>}
                {handleOk && <button className={'primary-green outline'} onClick={handleOk}>Ok </button>}
            </Modal.Footer>
        </Modal>
    );
}

export default ModalNormal;
