import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from "class-validator";

export class CreateProductRequestDto {
    @ApiProperty({ example: 'Mechanical keyboard' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    name!: string;

    @ApiPropertyOptional({ example: 'Red switches, Spanish layout' })
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    description?: string | null;

    @ApiProperty({ example: 15990, description: 'Price in cents (15990 = S/ 159.90)' })
    @IsInt()
    @Min(0)
    priceCents!: number

    @ApiProperty({ example: 25 })
    @IsInt()
    @Min(0)
    stock!: number;
}