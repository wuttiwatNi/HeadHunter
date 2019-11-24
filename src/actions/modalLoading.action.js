import { actionConstant } from "../constants/index";

export const modalLoadingAction = {
  show,
  close
};

function show() {
  return {
      type: actionConstant.modalLoading.SHOW_CLOSE_MODAL_LOADING,
      isShow: true,
  };
}

function close() {
  return {
      type: actionConstant.modalLoading.SHOW_CLOSE_MODAL_LOADING,
      isShow: false,
  };
}