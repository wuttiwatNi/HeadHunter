import axios from "axios";
import {config} from "../config";

export const clientUtil = {
    setErrorHandler,
    setDefaultInterceptors
};

function setDefaultInterceptors(instance = axios) {
    instance.interceptors.request.use(
        requestConfig => {
            const customRequestConfig = {...requestConfig};

            // set default headerBar
            customRequestConfig.headers = {
                "Content-Type": "application/json",
                // "Authorization": "Bearer " + store.getState().auth.accessToken,
                ...customRequestConfig.headers
            };

            if (config.REQUEST_LOG_ENABLED) {
                console.log(
                    "Request to [Start]:",
                    customRequestConfig.url,
                    "\n",
                    "Method: ",
                    customRequestConfig.method,
                    "\n",
                    "Params: ",
                    customRequestConfig.params,
                    "\n",
                    "Data: ",
                    customRequestConfig.data,
                    "\n",
                    "Headers: ",
                    customRequestConfig.headers
                );
            }

            return customRequestConfig;
        },
        requestError => {
            const {requestConfig} = requestError;

            if (config.REQUEST_LOG_ENABLED) {
                console.log("Request to [Failed]:", requestConfig.url);
            }

            return Promise.reject(requestError);
        }
    );

    instance.interceptors.response.use(
        response => {
            if (config.RESPONSE_LOG_ENABLED) {
                console.log(`Response from [${response.config.url}]:`, response);
            }
            return response;
        },
        error => {
            if (config.RESPONSE_LOG_ENABLED) {
                console.log(`Response error from ...:`, error);
            }
            return Promise.reject(error);
        }
    );
    console.log("Set default interceptors for Axios");
}

function setErrorHandler(instance = axios) {
    instance.interceptors.response.use(
        response => response,
        error => errorHandler(error)
    );
    console.log("Set default error handler for Axios");
}

function errorHandler(error) {
    return Promise.reject(error);
}
