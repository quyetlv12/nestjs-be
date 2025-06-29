import { IsDate, IsEnum, IsOptional, IsString } from "class-validator";
import { PageRequestDto } from "src/common/dto/page-request-dto";
import { OrderStatus } from "../entities/order.entity";

export class OrderSearchRequestDto extends PageRequestDto {
    @IsOptional()
    @IsDate()
    startDate?: Date;

    @IsOptional()
    @IsDate()
    endDate?: Date;

    @IsOptional()
    @IsEnum(OrderStatus)
    status?: OrderStatus;

    @IsOptional()
    @IsString()
    q?: string;

    constructor(page?: number, limit?: number, startDate?: Date, endDate?: Date, status?: OrderStatus, q?: string) {
        super(page, limit);
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.q = q;
    }
}