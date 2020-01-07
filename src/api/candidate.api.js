import client from "./client";
import { config } from "../config";
import { apiConstant } from "../constants";

export const candidateApi = {
  getCandidateList,
  getCandidate,
  createCandidate,
  editCandidate,
  deleteCandidate
};

function getCandidateList() {
  return client({
    method: "GET",
    url: `${config.API_RESOURCE_URL}${apiConstant.candidate.CANDIDATE}`
  });
}

function getCandidate(id) {
  return client({
    method: "GET",
    url: `${config.API_RESOURCE_URL}${apiConstant.candidate.CANDIDATE}/${id}`
  });
}

function createCandidate(data) {
  return client({
    method: "POST",
    data: data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    url: `${config.API_RESOURCE_URL}${apiConstant.candidate.CANDIDATE}`
  });
}

function editCandidate(data) {
  return client({
    method: "PUT",
    data: data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    url: `${config.API_RESOURCE_URL}${apiConstant.candidate.CANDIDATE}`
  });
}

function deleteCandidate(id) {
  return client({
    method: "DELETE",
    url: `${config.API_RESOURCE_URL}${apiConstant.candidate.CANDIDATE}/${id}`
  });
}