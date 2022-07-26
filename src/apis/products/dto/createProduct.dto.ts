import { ApiProperty } from "@nestjs/swagger";

export class CreateProductDto{
    @ApiProperty()
    name:string

    @ApiProperty()
    price:number

    @ApiProperty()
    description:string
}