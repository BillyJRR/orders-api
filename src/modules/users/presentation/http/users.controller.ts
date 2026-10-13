import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiOkResponse, ApiTags, } from '@nestjs/swagger';
import type { AuthenticatedUser } from '../../../auth/application/ports/token.service.js';
import { CurrentUser } from '../../../auth/presentation/http/decorators/current-user.decorator.js';
import { Public } from '../../../auth/presentation/http/decorators/public.decorator.js';
import { GetUserUseCase } from '../../application/use-cases/get-user.use-case.js';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case.js';
import { RegisterUserRequestDto } from './dto/register-user.request.dto.js';
import { UserResponseDto } from './dto/user.response.dto.js';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(
        private readonly registerUser: RegisterUserUseCase,
        private readonly getUser: GetUserUseCase,
    ) { }

    @Public()
    @Post()
    @ApiCreatedResponse({ type: UserResponseDto })
    @ApiConflictResponse({ description: 'The email is already registered' })
    async register(@Body() dto: RegisterUserRequestDto): Promise<UserResponseDto> {
        const user = await this.registerUser.execute({
            email: dto.email,
            password: dto.password,
            fullName: dto.fullName,
        });
        return UserResponseDto.from(user);
    }

    @Get('me')
    @ApiBearerAuth()
    @ApiOkResponse({ type: UserResponseDto })
    async me(@CurrentUser() current: AuthenticatedUser): Promise<UserResponseDto> {
        const user = await this.getUser.execute(current.id);
        return UserResponseDto.from(user);
    }
}