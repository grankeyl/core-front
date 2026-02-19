import api from "../index";
import Cookies from "js-cookie";

export async function me(initData: string) {
  try {
    const response = await api.get(
      "/users/me",
      { headers: { Authorization: "tma " + initData } }
    );

    if (response.status === 200) {
      Cookies.set("init-data", "tma " + initData);
      return response.data;
    }
    return false;
  } catch {
    return false;
  }
}
