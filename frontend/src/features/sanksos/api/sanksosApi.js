import apiHelper from "../../../helpers/apiHelper";

export const sanksosApi = {
  getSanksos: () => apiHelper("/sanksos", { method: "GET" }),
  ajukanSanksos: (data) => apiHelper("/sanksos", { method: "POST", body: data }),
  // aksi: setujui (+tugas) | tolak | selesai (Bapak Asrama) | dikerjakan (mahasiswa)
  aksiSanksos: (id, data) => apiHelper(`/sanksos/${id}`, { method: "PATCH", body: data }),
};

export default sanksosApi;
