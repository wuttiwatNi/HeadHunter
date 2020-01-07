import client from "./client";
import { config } from "../config";
import { apiConstant } from "../constants";

export const activityApi = {
  getActivityList,
  getActivity,
  getActivityByCandidateId,
  createActivity,
  editActivity,
  deleteActivity
};

function getActivityList() {
  return client({
    method: "GET",
    url: `${config.API_RESOURCE_URL}${apiConstant.activity.ACTIVITYS}`
  });
}

function getActivity(id) {
  return client({
    method: "GET",
    url: `${config.API_RESOURCE_URL}${apiConstant.activity.ACTIVITYS}/${id}`
  });
}

function getActivityByCandidateId(candidateId) {
  return client({
    method: "GET",
    url: `${config.API_RESOURCE_URL}${apiConstant.activity.ACTIVITYS}/candidateId/${candidateId}`
  });
}

function createActivity(data) {
  return client({
    method: "POST",
    data: data,
    url: `${config.API_RESOURCE_URL}${apiConstant.activity.ACTIVITYS}`
  });
}

function editActivity(data) {
  return client({
    method: "PUT",
    data: data,
    url: `${config.API_RESOURCE_URL}${apiConstant.activity.ACTIVITYS}`
  });
}

function deleteActivity(id) {
  return client({
    method: "DELETE",
    url: `${config.API_RESOURCE_URL}${apiConstant.activity.ACTIVITYS}/${id}`
  });
}