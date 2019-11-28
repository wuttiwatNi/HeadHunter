import client from "./client";
import { config } from "../config";
import { apiConstant } from "../constants";

export const languageSkillApi = {
  getLanguageSkillList,
  getLanguageSkill,
  createLanguageSkill,
  editLanguageSkill,
  deleteLanguageSkill
};

function getLanguageSkillList() {
  return client({
    method: "GET",
    url: `${config.API_RESOURCE_URL}${apiConstant.languageSkill.LANGUAGE_SKILLS}`
  });
}

function getLanguageSkill(id) {
  return client({
    method: "GET",
    url: `${config.API_RESOURCE_URL}${apiConstant.languageSkill.LANGUAGE_SKILLS}/${id}`
  });
}

function createLanguageSkill(data) {
  return client({
    method: "POST",
    data: data,
    url: `${config.API_RESOURCE_URL}${apiConstant.languageSkill.LANGUAGE_SKILLS}`
  });
}

function editLanguageSkill(data) {
  return client({
    method: "PUT",
    data: data,
    url: `${config.API_RESOURCE_URL}${apiConstant.languageSkill.LANGUAGE_SKILLS}`
  });
}

function deleteLanguageSkill(id) {
  return client({
    method: "DELETE",
    url: `${config.API_RESOURCE_URL}${apiConstant.languageSkill.LANGUAGE_SKILLS}/${id}`
  });
}