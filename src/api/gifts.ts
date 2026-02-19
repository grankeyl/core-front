import api from "./index";
import Cookies from "js-cookie";
import type { Gift } from "../types/gifts";

export const giftsApi = {
    /**
     * Get user gifts
     * @returns Promise with array of gifts
     */
    async getGifts(): Promise<Gift[]> {
        const initData = Cookies.get("init-data");
        const response = await api.get<Gift[]>("/gifts", {
            headers: { Authorization: initData || "" },
        });
        return response.data;
    },

    /**
     * Withdraw gift (transfer to Telegram)
     * @param id - Gift ID
     * @returns Promise with response data
     */
    async withdraw(id: string): Promise<any> {
        const initData = Cookies.get("init-data");
        const response = await api.post(`/gifts/${id}/withdraw`, {}, {
            headers: { Authorization: initData || "" },
        });
        return response.data;
    },
};
