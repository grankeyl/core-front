export interface Gift {
    id: string;
    externalId: string;
    title: string;
    ownerId: string;
    slug: string;
    image: string;
    animation: string;
    cost: number;
    num: number;
    availabilityIssued: number;
    availabilityTotal: number;
}

export interface User {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    photoUrl: string;
}

export interface Participant {
    id: string;
    sum: number;
    user: User;
}

export interface Auction {
    id: string;
    status: "ACTIVE" | "COMPLETED" | "CANCELLED";
    createdAt: string;
    deadline: string;
    creatorId: string;
    targetSum: number;
    giftPriceOnStart: number;
    gift: Gift;
    purchasedSum: number;
    mySum: number;
}

export interface AuctionDetail extends Auction {
    participants: Participant[];
}

export interface AuctionsParams {
    withMe?: boolean;
    onlyActive?: boolean;
}
