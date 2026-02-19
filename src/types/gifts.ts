export interface Gift {
    id: string;
    externalId: string;
    title: string;
    ownerId: string;
    slug: string;
    num: number;
    availabilityIssued: number;
    availabilityTotal: number;
    image: string;
    animation: string;
    cost: number;
    inAuction: boolean;
    inFund: boolean;
}
