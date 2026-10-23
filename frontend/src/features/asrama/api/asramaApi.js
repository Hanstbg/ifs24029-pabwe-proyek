import apiHelper from "../../../helpers/apiHelper";

export const asramaApi = {
  getAsrama: () => apiHelper("/asrama", { method: "GET" }),
};

export default asramaApi;