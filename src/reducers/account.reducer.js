import { actionConstant } from "../constants/index"

const initialState = {
  id: -1,
  firstName: "Wuttiwat",
  lastName: "Nipitchayounggoorn",
  picturePath: "",
  role: "",
  token: ""
}

const accountReducer = (state = initialState, action) => {
  if (action.type === actionConstant.account.LOGIN) {
    return {
      ...state,
      id: action.id,
      firstName: action.firstName,
      lastName: action.lastName,
      picturePath: action.picturePath,
      role: action.role,
      token: action.token
    }
  } else if (action.type === actionConstant.account.UPDATE_PROFILE) {
    return {
      ...state,
      firstName: action.firstName,
      lastName: action.lastName,
      picturePath: action.picturePath
    }
  } else if (action.type === actionConstant.account.LOGOUT) {
    return {
      ...state,
      id: "",
      firstName: "",
      lastName: "",
      picturePath: "",
      role: "",
      token: ""
    }
  } else {
    return state
  }
}

export default accountReducer
