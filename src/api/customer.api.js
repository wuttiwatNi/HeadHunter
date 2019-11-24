import client from "./client";
import { config } from "../config";
import { apiConstant } from "../constants";

export const customerApi = {
  getCustomerList,
  getCustomer,
  createCustomer,
  deleteCustomer
};

function getCustomerList() {
  return client({
    method: "GET",
    url: `${config.API_RESOURCE_URL}${apiConstant.customer.CUSTOMERS}`
  });
}

function getCustomer(id) {
  return client({
    method: "GET",
    url: `${config.API_RESOURCE_URL}${apiConstant.customer.CUSTOMERS}/${id}`
  });
}

function createCustomer(data) {
  return client({
    method: "POST",
    data: data,
    url: `${config.API_RESOURCE_URL}${apiConstant.customer.CUSTOMERS}`
  });
}

function deleteCustomer(id) {
  return client({
    method: "DELETE",
    url: `${config.API_RESOURCE_URL}${apiConstant.customer.CUSTOMERS}/${id}`
  });
}