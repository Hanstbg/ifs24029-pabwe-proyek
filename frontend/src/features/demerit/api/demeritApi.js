import apiHelper from "../../../helpers/apiHelper";

export const demeritApi = {
  getDemerit: () => apiHelper("/demerit", { method: "GET" }),
  getRingkasan: () => apiHelper("/ringkasan", { method: "GET" }),
};

export default demeritApi;
