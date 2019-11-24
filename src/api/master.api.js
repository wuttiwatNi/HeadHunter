import client from "./client";
import { config } from "../config";
import { apiConstant } from "../constants";

export const masterApi = {
  getProvinceList,
  getAmphureListByProvinceId,
  getDistrictListByAmphureId
};

function getProvinceList() {
  return client({
    method: "GET",
    url: `${config.API_RESOURCE_URL}${apiConstant.master.GET_PROVINCE_LIST}`
  });
}

function getAmphureListByProvinceId(provinceId) {
  return client({
    method: "GET",
    url: `${config.API_RESOURCE_URL}${apiConstant.master.GET_AMPHURE_LIST}/${provinceId}`
  });
}

function getDistrictListByAmphureId(amphureId) {
  return client({
    method: "GET",
    url: `${config.API_RESOURCE_URL}${apiConstant.master.GET_DISTRICT_LIST}/${amphureId}`
  });
}