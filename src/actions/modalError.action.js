import { actionConstant } from "../constants/index";

export const modalErrorAction = {
  show,
  close,
  setDes
};

function show() {
  return {
      type: actionConstant.modalError.SHOW_CLOSE_MODAL_ERROR,
      isShow: true,
  };
}

function close() {
  return {
      type: actionConstant.modalError.SHOW_CLOSE_MODAL_ERROR,
      isShow: false,
  };
}

function setDes(des) {
  return {
      type: actionConstant.modalError.SET_DES,
      des: des,
  };
}