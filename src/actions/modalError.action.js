import { actionConstant } from "../constants/index";

export const modalErrorAction = {
  show,
  close
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