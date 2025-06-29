import { IsNotEmpty, IsNumber } from "class-validator";

export class CreatePaymentDto {

  @IsNotEmpty()
  @IsNumber()
  orderId: number;
}
