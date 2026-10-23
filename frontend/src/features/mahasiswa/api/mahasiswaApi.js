import apiHelper from "../../../helpers/apiHelper";

export const mahasiswaApi = {
  getMahasiswa: () => apiHelper("/mahasiswa", { method: "GET" }),
  addMahasiswa: (data) => apiHelper("/mahasiswa", { method: "POST", body: data }),
  updateKamar: (id, kamar) => apiHelper(`/mahasiswa/${id}`, { method: "PATCH", body: { kamar } }),
};

export default mahasiswaApi;