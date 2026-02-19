import api from "./index";
import Cookies from "js-cookie";

export async function connect(address: string) {
  try {
    const initData = Cookies.get("init-data");
    const response = await api.post(
      "/wallets/connect",
      { address },
      { headers: { Authorization: initData } }
    );

    if (response.status === 200) {
      return response.data;
    }
    return false;
  } catch (error) {
    console.error("Wallet connect error:", error);
    return false;
  }
}

export async function disconnect(address: string) {
  try {
    const initData = Cookies.get("init-data");
    const response = await api.post(
      "/wallets/disconnect",
      { address },
      { headers: { Authorization: initData } }
    );

    if (response.status === 200) {
      return response.data;
    }
    return false;
  } catch (error) {
    console.error("Wallet disconnect error:", error);
    return false;
  }
}
