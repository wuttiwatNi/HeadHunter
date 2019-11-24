import { actionConstant } from "../constants/index";

const initialState = {
  isShow: false
};

const modalLoadingReducer = (state = initialState, action) => {
  if (action.type === actionConstant.modalLoading.SHOW_CLOSE_MODAL_LOADING) {
    return {
      ...state,
      isShow: action.isShow
    };
  } else {
    return state;
  }
};

export default modalLoadingReducer;
