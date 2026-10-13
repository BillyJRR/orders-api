import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LoginUseCase } from '../../application/use-cases/login.use-case.js';
import { Public } from './decorators/public.decorator.js';
import { LoginRequestDto } from './dto/login.request.dto.js';
import { TokenResponseDto } from './dto/token.response.dto.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly loginUseCase: LoginUseCase) { }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: TokenResponseDto })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
    async login(@Body() dto: LoginRequestDto): Promise<TokenResponseDto> {
        const token = await this.loginUseCase.execute({
            email: dto.email,
            password: dto.password,
        });

        return { accessToken: token.accessToken, tokenType: 'Bearer', expiresIn: token.expiresIn };
    }
}