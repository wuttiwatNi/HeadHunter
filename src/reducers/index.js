import { combineReducers } from "redux";
import sideBar from "./sideBar.reducer";
import modalError from "./modalError.reducer";
import modalLoading from "./modalLoading.reducer";
export default combineReducers({
  sideBar,
  modalError,
  modalLoading
});
