import api from "./index";
import Cookies from "js-cookie";
import type { DAO } from "../types/dao";

export const daoApi = {
  async getDAOList(): Promise<DAO[]> {
    const initData = Cookies.get("init-data");
    const response = await api.get<DAO[]>("/dao", {
      headers: { Authorization: initData || "" },
    });
    return response.data;
  },
};
