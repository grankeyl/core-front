import api from "./index";
import Cookies from "js-cookie";
import type { Fund, FundDetail, FundsParams } from "../types/funds";

export const fundsApi = {
    /**
     * Get list of funds
     * @param params - Query parameters for filtering funds
     * @returns Promise with array of funds
     */
    async getFunds(params?: FundsParams): Promise<Fund[]> {
        const initData = Cookies.get("init-data");
        const response = await api.get<Fund[]>("/funds", {
            params: {
                withMe: params?.withMe ?? false,
                onlyActive: params?.onlyActive ?? true,
                type: params?.type,
                sort: params?.sort ?? "LATEST",
            },
            headers: { Authorization: initData || "" },
        });
        return response.data;
    },

    /**
     * Get fund details by ID
     * @param id - Fund ID
     * @returns Promise with fund details including fractions
     */
    async getFundById(id: string): Promise<FundDetail> {
        const initData = Cookies.get("init-data");
        const response = await api.get<FundDetail>(`/funds/${id}`, {
            headers: { Authorization: initData || "" },
        });
        return response.data;
    },

    /**
     * Buy fractions (shares) in a fund
     * @param id - Fund ID
     * @param quantity - Number of shares to buy
     * @returns Promise with response
     */
    async buyFractions(id: string, quantity: number): Promise<void> {
        const initData = Cookies.get("init-data");
        const response = await api.post(`/funds/${id}/fractions`, {
            quantity,
        }, {
            headers: { Authorization: initData || "" },
        });
        return response.data;
    },
};
