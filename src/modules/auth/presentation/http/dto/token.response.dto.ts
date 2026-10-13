import { ApiProperty } from '@nestjs/swagger';

export class TokenResponseDto {
    @ApiProperty()
    accessToken!: string;

    @ApiProperty({ example: 'Bearer' })
    tokenType!: string;

    @ApiProperty({ description: 'Seconds until the token expires', example: 3600 })
    expiresIn!: number;
}