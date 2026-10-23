import apiHelper from "../../../helpers/apiHelper";

export const authApi = {
  login: (data) => apiHelper("/auth/login", { method: "POST", body: data }),
  register: (data) => apiHelper("/auth/register", { method: "POST", body: data }),
  updateProfil: (data) => apiHelper("/profil", { method: "PUT", body: data }),
  getMe: () => apiHelper("/auth/me", { method: "GET" }),
};

export default authApi;