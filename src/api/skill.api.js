import client from "./client";
import { config } from "../config";
import { apiConstant } from "../constants";

export const skillApi = {
  getSkillList,
  getSkill,
  createSkill,
  editSkill,
  deleteSkill
};

function getSkillList() {
  return client({
    method: "GET",
    url: `${config.API_RESOURCE_URL}${apiConstant.skill.SKILLS}`
  });
}

function getSkill(id) {
  return client({
    method: "GET",
    url: `${config.API_RESOURCE_URL}${apiConstant.skill.SKILLS}/${id}`
  });
}

function createSkill(data) {
  return client({
    method: "POST",
    data: data,
    url: `${config.API_RESOURCE_URL}${apiConstant.skill.SKILLS}`
  });
}

function editSkill(data) {
  return client({
    method: "PUT",
    data: data,
    url: `${config.API_RESOURCE_URL}${apiConstant.skill.SKILLS}`
  });
}

function deleteSkill(id) {
  return client({
    method: "DELETE",
    url: `${config.API_RESOURCE_URL}${apiConstant.skill.SKILLS}/${id}`
  });
}