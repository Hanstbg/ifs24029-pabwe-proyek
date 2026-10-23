import authApi from "../api/authApi";
import { putAccessToken, removeAccessToken } from "../../../helpers/apiHelper";
import { showErrorDialog } from "../../../helpers/toolsHelper";
import { loginStart, loginSuccess, loginFailure, setUser, clearUser } from "./reducer";

export function asyncFetchMe() {
  return async (dispatch) => {
    try {
      const result = await authApi.getMe();
      dispatch(setUser(result?.user ?? null));
    } catch {
      // Token tidak valid atau sudah kedaluwarsa.
      removeAccessToken();
      dispatch(clearUser());
    }
  };
}

export function asyncLoginUser({ nim, password }) {
  return async (dispatch) => {
    dispatch(loginStart());
    try {
      const result = await authApi.login({ nim, password });
      putAccessToken(result.token);
      dispatch(setUser(result.user));
      dispatch(loginSuccess());
      return true;
    } catch (error) {
      dispatch(loginFailure());
      await showErrorDialog(error.message);
      return false;
    }
  };
}

export function asyncRegisterUser({ nama, nim, password, asrama, foto }) {
  return async (dispatch) => {
    dispatch(loginStart());
    try {
      const result = await authApi.register({ nama, nim, password, asrama, foto });
      putAccessToken(result.token);
      dispatch(setUser(result.user));
      dispatch(loginSuccess());
      return true;
    } catch (error) {
      dispatch(loginFailure());
      await showErrorDialog(error.message);
      return false;
    }
  };
}

export function asyncLogoutUser() {
  return (dispatch) => {
    removeAccessToken();
    dispatch(clearUser());
  };
}
