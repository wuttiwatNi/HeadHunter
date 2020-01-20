import { actionConstant } from "../constants/index"

export const accountAction = {
  login,
  logout,
  updateProfile
}

function login(object) {
  return {
    type: actionConstant.account.LOGIN,
    id: object.id,
    firstName: object.firstName,
    lastName: object.lastName,
    picturePath: object.picturePath,
    role: object.role,
    token: object.token
  }
}

function logout() {
  return {
    type: actionConstant.account.LOGOUT
  }
}

function updateProfile(object) {
  return {
    type: actionConstant.account.UPDATE_PROFILE,
    firstName: object.firstName,
    lastName: object.lastName,
    picturePath: object.picturePath
  }
}
