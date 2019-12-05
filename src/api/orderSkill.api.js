import client from "./client";
import { config } from "../config";
import { apiConstant } from "../constants";

export const orderSkillApi = {
  createOrderSkill,
  deleteOrderSkill
};

function createOrderSkill(data) {
  return client({
    method: "POST",
    data: data,
    url: `${config.API_RESOURCE_URL}${apiConstant.orderSkill.ORDER_SKILLS}`
  });
}

function deleteOrderSkill(id) {
  return client({
    method: "DELETE",
    url: `${config.API_RESOURCE_URL}${apiConstant.orderSkill.ORDER_SKILLS}/${id}`
  });
}