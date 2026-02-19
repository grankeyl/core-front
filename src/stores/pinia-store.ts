import { defineStore } from 'pinia';
import type { Gift } from '@/types/gifts';

export const useCacheStore = defineStore('cache', {
  state: () => ({
    UserData: { Rank: 0 },
    UserDataMeta: {},

    PortfolioSelectedGiftsBurn: [] as Gift[],
  }),
});