import type { Gift } from "./gifts";

export type CraftStatus = "ACTIVE" | "COMPLETED" | "CLOSED";

export interface CraftMember {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  gift: Gift;
}

export interface CraftPoolGiftInfo {
  image: string;
  collectionName: string;
}

export interface CraftPool {
  id: string;
  status: CraftStatus;
  members: CraftMember[];
  giftInfo: CraftPoolGiftInfo;
  createdAt: string;
  updatedAt: string;
  deadline: string;
}

export interface CraftPoolGrouped {
  slug: string;
  title: string;
  image: string;
  poolCount: number;
  pools: CraftPool[];
}

export interface CraftCollection {
  collectionName: string;
  image: string;
  count: number;
}
