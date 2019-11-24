import axios from "axios";
import { config } from "../config";

// client with timeout
const client = axiosConfig => {
  let source = axios.CancelToken.source();

  const timeout = setTimeout(() => {
    source.cancel(`Timeout of ${config.NETWORK_TIMEOUT}ms.`);
  }, config.NETWORK_TIMEOUT);

  return axios({
    ...axiosConfig,
    cancelToken: source.token
  }).then(response => {
    // clear timeout if responded in time
    clearTimeout(timeout);
    return response;
  });
};

export default client;
