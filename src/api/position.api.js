import client from "./client";
import { config } from "../config";
import { apiConstant } from "../constants";

export const positionApi = {
  getCategoryList,
  getPositionListByCategoryId,
  getPosition,
  createPosition,
  editPosition,
  deletePosition
};

function getCategoryList() {
  return client({
    method: "GET",
    url: `${config.API_RESOURCE_URL}${apiConstant.position.POSITION}`
  });
}

function getPositionListByCategoryId(id) {
  return client({
    method: "GET",
    url: `${config.API_RESOURCE_URL}${apiConstant.position.POSITION}/parentId/${id}`
  });
}

function getPosition(id) {
  return client({
    method: "GET",
    url: `${config.API_RESOURCE_URL}${apiConstant.position.POSITION}/${id}`
  });
}

function createPosition(data) {
  return client({
    method: "POST",
    data: data,
    url: `${config.API_RESOURCE_URL}${apiConstant.position.POSITION}`
  });
}

function editPosition(data) {
  return client({
    method: "PUT",
    data: data,
    url: `${config.API_RESOURCE_URL}${apiConstant.position.POSITION}`
  });
}

function deletePosition(id) {
  return client({
    method: "DELETE",
    url: `${config.API_RESOURCE_URL}${apiConstant.position.POSITION}/${id}`
  });
}