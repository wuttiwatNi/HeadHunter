import client from "./client";
import { config } from "../config";
import { apiConstant } from "../constants";

export const orderLanguageSkillApi = {
  createOrderLanguageSkill,
  deleteOrderLanguageSkill
};

function createOrderLanguageSkill(data) {
  return client({
    method: "POST",
    data: data,
    url: `${config.API_RESOURCE_URL}${apiConstant.orderLanguageSkill.ORDER_LANGUAGE_SKILLS}`
  });
}

function deleteOrderLanguageSkill(id) {
  return client({
    method: "DELETE",
    url: `${config.API_RESOURCE_URL}${apiConstant.orderLanguageSkill.ORDER_LANGUAGE_SKILLS}/${id}`
  });
}