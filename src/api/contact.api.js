import client from "./client";
import { config } from "../config";
import { apiConstant } from "../constants";

export const contactApi = {
  createContact,
  editContact,
  deleteContact
};

function createContact(data) {
  return client({
    method: "POST",
    data: data,
    url: `${config.API_RESOURCE_URL}${apiConstant.contact.CONTACTS}`
  });
}

function editContact(data) {
  return client({
    method: "PUT",
    data: data,
    url: `${config.API_RESOURCE_URL}${apiConstant.contact.CONTACTS}`
  });
}

function deleteContact(id) {
  return client({
    method: "DELETE",
    url: `${config.API_RESOURCE_URL}${apiConstant.contact.CONTACTS}/${id}`
  });
}