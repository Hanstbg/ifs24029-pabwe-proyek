import asramaApi from "../api/asramaApi";
import { toArray } from "../../../helpers/dataHelper";
import { showErrorDialog } from "../../../helpers/toolsHelper";
import { fetchAsramaStart, fetchAsramaSuccess, fetchAsramaFailure } from "./reducer";

export function asyncFetchAsrama() {
  return async (dispatch) => {
    dispatch(fetchAsramaStart());
    try {
      const result = await asramaApi.getAsrama();
      dispatch(fetchAsramaSuccess(toArray(result)));
    } catch (error) {
      dispatch(fetchAsramaFailure());
      await showErrorDialog(error.message);
    }
  };
}