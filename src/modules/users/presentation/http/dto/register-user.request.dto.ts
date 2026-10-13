import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterUserRequestDto {
    @ApiProperty({ example: 'billy@example.com' })
    @IsEmail()
    @MaxLength(255)
    email!: string;

    @ApiProperty({ example: 'Secret123', minLength: 8 })
    @IsString()
    @MinLength(8)
    @MaxLength(128)
    password!: string;

    @ApiProperty({ example: 'Billy Romero' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    fullName!: string;
}