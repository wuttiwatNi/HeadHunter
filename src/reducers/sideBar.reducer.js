import { actionConstant } from "../constants/index";

const initialState = {
  isShow: true
};

const sideBarReducer = (state = initialState, action) => {
  if (action.type === actionConstant.sideBar.SHOW_HIDE_SIDE_BAR) {
    return {
      ...state,
      isShow: !state.isShow
    };
  } else {
    return state;
  }
};

export default sideBarReducer;
