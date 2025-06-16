export class CreateTalentDto {
    name: string;
    title: string;
    price: number;
    availableFor24hDelivery: boolean;
    email: string;
    rating: number;
    totalReviews: number;
    lastCompletedVideoAt: Date;
    averageVideoLength: string;
    description: string;
    password: string;
    reasonsToGetAVideo?: string[];
    businessId?: number;
    roles?: [];
}
