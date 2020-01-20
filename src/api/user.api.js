import client from "./client";
import { config } from "../config";
import { apiConstant } from "../constants";

export const userApi = {
  getUserList,
  getUser,
  createUser,
  editUser,
  deleteUser,
  signInUser,
  changePasswordUser,
  resetPasswordUser
};

function getUserList() {
  return client({
    method: "GET",
    url: `${config.API_RESOURCE_URL}${apiConstant.user.USER}`
  });
}

function getUser(id) {
  return client({
    method: "GET",
    url: `${config.API_RESOURCE_URL}${apiConstant.user.USER}/${id}`
  });
}

function createUser(data) {
  return client({
    method: "POST",
    data: data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    url: `${config.API_RESOURCE_URL}${apiConstant.user.USER}`
  });
}

function editUser(data) {
  return client({
    method: "PUT",
    data: data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    url: `${config.API_RESOURCE_URL}${apiConstant.user.USER}`
  });
}

function deleteUser(id) {
  return client({
    method: "DELETE",
    url: `${config.API_RESOURCE_URL}${apiConstant.user.USER}/${id}`
  });
}

function signInUser(data) {
  return client({
    method: "POST",
    data: data,
    url: `${config.API_RESOURCE_URL}${apiConstant.user.SIGN_IN}`
  });
}

function changePasswordUser(data) {
  return client({
    method: "POST",
    data: data,
    url: `${config.API_RESOURCE_URL}${apiConstant.user.USER}/changePassword`
  });
}

function resetPasswordUser(id) {
  return client({
    method: "GET",
    url: `${config.API_RESOURCE_URL}${apiConstant.user.USER}/forgetPassword/${id}`
  });
}