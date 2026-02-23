import api from "./index";
import Cookies from "js-cookie";
import type { Auction, AuctionDetail, AuctionsParams } from "../types/auctions";

export const auctionsApi = {
    /**
     * Get list of auctions
     * @param params - Query parameters for filtering auctions
     * @returns Promise with array of auctions
     */
    async getAuctions(params?: AuctionsParams): Promise<Auction[]> {
        const initData = Cookies.get("init-data");
        const response = await api.get<Auction[]>("/auctions", {
            params: {
                withMe: params?.withMe ?? false,
                onlyActive: params?.onlyActive ?? true,
            },
            headers: { Authorization: initData || "" },
        });
        return response.data;
    },

    /**
     * Get auction details by ID
     * @param id - Auction ID
     * @returns Promise with auction details including participants
     */
    async getAuctionById(id: string): Promise<AuctionDetail> {
        const initData = Cookies.get("init-data");
        const response = await api.get<AuctionDetail>(`/auctions/${id}`, {
            headers: { Authorization: initData || "" },
        });
        return response.data;
    },

    /**
     * Participate in auction (place bid)
     * @param id - Auction ID
     * @param sum - Bid amount
     */
    async participate(id: string, sum: number): Promise<void> {
        const initData = Cookies.get("init-data");
        await api.post(
            `/auctions/${id}/participate`,
            { sum },
            { headers: { Authorization: initData || "" } }
        );
    },

    /**
     * Create auction (burn gifts)
     * @param giftIds - Array of gift IDs to burn
     */
    async createAuction(giftIds: string[]): Promise<void> {
        const initData = Cookies.get("init-data");
        await api.post(
            "/auctions",
            { giftIds },
            { headers: { Authorization: initData || "" } }
        );
    },
};
