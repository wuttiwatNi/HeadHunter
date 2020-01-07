import client from "./client";
import { config } from "../config";
import { apiConstant } from "../constants";

export const nationalityApi = {
  getNationalityList,
  createNationality,
  editNationality,
  deleteNationality
};

function getNationalityList() {
  return client({
    method: "GET",
    url: `${config.API_RESOURCE_URL}${apiConstant.nationality.NATIONALITY}`
  });
}

function createNationality(data) {
  return client({
    method: "POST",
    data: data,
    url: `${config.API_RESOURCE_URL}${apiConstant.nationality.NATIONALITY}`
  });
}

function editNationality(data) {
  return client({
    method: "PUT",
    data: data,
    url: `${config.API_RESOURCE_URL}${apiConstant.nationality.NATIONALITY}`
  });
}

function deleteNationality(id) {
  return client({
    method: "DELETE",
    url: `${config.API_RESOURCE_URL}${apiConstant.nationality.NATIONALITY}/${id}`
  });
}