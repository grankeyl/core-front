export interface CostStatistics {
    "1d": number[];
    "7d": number[];
}

export interface AttributeRarity {
    title: string | null;
    perMille: number | null;
}

export interface ModelAttribute {
    name: string;
    image: string;
    rarity: AttributeRarity;
}

export interface PatternAttribute {
    name: string;
    image: string;
    rarity: AttributeRarity;
}

export interface BackdropAttribute {
    name: string;
    rarity: AttributeRarity;
    edgeColor: number;
    textColor: number;
    centerColor: number;
    patternColor: number;
}

export interface GiftAttributes {
    model?: ModelAttribute;
    pattern?: PatternAttribute;
    backdrop?: BackdropAttribute;
}

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
    costStatistics?: CostStatistics;
    attributes?: GiftAttributes;
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
    status: "ACTIVE" | "BUYING" | "COMPLETED" | "CANCELLED";
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

export type FundSort = 'LATEST' | 'LOW_COST' | 'HIGH_COST';

export type FundType = 'GIFT' | 'PHONE' | 'NICKNAME';

export interface FundsParams {
    withMe?: boolean;
    onlyActive?: boolean;
    type?: FundType;
    sort?: FundSort;
}
