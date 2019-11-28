import client from "./client";
import { config } from "../config";
import { apiConstant } from "../constants";

export const orderApi = {
  getOrderList,
  getOrder,
  createOrder,
  editOrder,
  deleteOrder
};

function getOrderList() {
  return client({
    method: "GET",
    url: `${config.API_RESOURCE_URL}${apiConstant.order.ORDERS}`
  });
}

function getOrder(id) {
  return client({
    method: "GET",
    url: `${config.API_RESOURCE_URL}${apiConstant.order.ORDERS}/${id}`
  });
}

function createOrder(data) {
  return client({
    method: "POST",
    data: data,
    url: `${config.API_RESOURCE_URL}${apiConstant.order.ORDERS}`
  });
}

function editOrder(data) {
  return client({
    method: "PUT",
    data: data,
    url: `${config.API_RESOURCE_URL}${apiConstant.order.ORDERS}`
  });
}

function deleteOrder(id) {
  return client({
    method: "DELETE",
    url: `${config.API_RESOURCE_URL}${apiConstant.order.ORDERS}/${id}`
  });
}