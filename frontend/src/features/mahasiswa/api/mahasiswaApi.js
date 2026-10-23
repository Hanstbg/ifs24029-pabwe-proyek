import apiHelper from "../../../helpers/apiHelper";

export const mahasiswaApi = {
  getMahasiswa: () => apiHelper("/mahasiswa", { method: "GET" }),
  addMahasiswa: (data) => apiHelper("/mahasiswa", { method: "POST", body: data }),
};

export default mahasiswaApi;
