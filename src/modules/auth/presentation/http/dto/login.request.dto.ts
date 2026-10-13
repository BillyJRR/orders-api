import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginRequestDto {
    @ApiProperty({ example: 'billy@example.com' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: 'Secret123' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(128)
    password!: string;
}