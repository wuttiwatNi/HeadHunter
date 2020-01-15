import { actionConstant } from "../constants/index";

const initialState = {
  isShow: false,
  des: ""
};

const modalErrorReducer = (state = initialState, action) => {
  if (action.type === actionConstant.modalError.SHOW_CLOSE_MODAL_ERROR) {
    return {
      ...state,
      isShow: action.isShow
    };
  } else if (action.type === actionConstant.modalError.SET_DES) {
    return {
      ...state,
      des: action.des
    };
  } else {
    return state;
  }
};

export default modalErrorReducer;
