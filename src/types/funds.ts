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

export interface Fraction {
    id: string;
    user: User;
    quantity: number;
}

export interface Fund {
    id: string;
    status: "ACTIVE" | "COMPLETED" | "CANCELLED";
    createdAt: string;
    deadline: string;
    sellPrice: number | null;
    valuation: number;
    fractionNum: number;
    fractionPrice: number;
    type: string;
    gift: Gift;
    purchasedFractionNum: number;
    myFractionNum: number;
}

export interface FundDetail extends Fund {
    fractions: Fraction[];
}

export interface FundsParams {
    withMe?: boolean;
    onlyActive?: boolean;
}
