import api from "./index";
import Cookies from "js-cookie";
import type { CraftPool, CraftCollection } from "../types/craft";

export const craftApi = {
  /**
   * Get all craft pools
   */
  async getCrafts(): Promise<CraftPool[]> {
    const initData = Cookies.get("init-data");
    const response = await api.get<CraftPool[]>("/craft", {
      headers: { Authorization: initData || "" },
    });
    return response.data;
  },

  /**
   * Create a new craft pool
   */
  async createCraft(giftIds: string[]): Promise<CraftPool> {
    const initData = Cookies.get("init-data");
    const response = await api.post<CraftPool>(
      "/craft",
      { giftIds },
      { headers: { Authorization: initData || "" } }
    );
    return response.data;
  },

  /**
   * Get craft pool by ID
   */
  async getCraftById(id: string): Promise<CraftPool> {
    const initData = Cookies.get("init-data");
    const response = await api.get<CraftPool>(`/craft/${id}`, {
      headers: { Authorization: initData || "" },
    });
    return response.data;
  },

  /**
   * Get craft pools by collection name
   */
  async getCollectionByName(collectionName: string): Promise<CraftPool[]> {
    const initData = Cookies.get("init-data");
    const response = await api.get<CraftPool[]>(`/craft/collections/${encodeURIComponent(collectionName)}`, {
      headers: { Authorization: initData || "" },
    });
    return response.data;
  },

  /**
   * Get gift collections (categories)
   */
  async getCollections(): Promise<CraftCollection[]> {
    const initData = Cookies.get("init-data");
    const response = await api.get<CraftCollection[]>("/craft/collections", {
      headers: { Authorization: initData || "" },
    });
    return response.data;
  },

  /**
   * Participate in a craft pool
   */
  async participate(id: string, giftIds: string[]): Promise<void> {
    const initData = Cookies.get("init-data");
    await api.post(
      `/craft/${id}/participate`,
      { giftIds },
      { headers: { Authorization: initData || "" } }
    );
  },
};
