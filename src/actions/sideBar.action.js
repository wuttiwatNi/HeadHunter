import { actionConstant } from "../constants/index";

export const sideBarAction = {
  toggleButton
};

function toggleButton() {
  return {
    type: actionConstant.sideBar.SHOW_HIDE_SIDE_BAR
  };
}
