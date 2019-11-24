import { actionConstant } from "../constants/index";

const initialState = {
  isShow: false
};

const modalErrorReducer = (state = initialState, action) => {
  if (action.type === actionConstant.modalError.SHOW_CLOSE_MODAL_ERROR) {
    return {
      ...state,
      isShow: action.isShow
    };
  } else {
    return state;
  }
};

export default modalErrorReducer;
