import apiHelper from "../../../helpers/apiHelper";

export const pelanggaranApi = {
  getPelanggaran: () => apiHelper("/pelanggaran", { method: "GET" }),
  addPelanggaran: (data) => apiHelper("/pelanggaran", { method: "POST", body: data }),
};

export default pelanggaranApi;
