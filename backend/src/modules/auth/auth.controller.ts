import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new parent user account' })
  @ApiResponse({ status: 201, description: 'User account successfully registered.' })
  @ApiResponse({ status: 400, description: 'Bad Request / validation error or role restriction violation.' })
  @ApiResponse({ status: 409, description: 'Conflict - email already registered.' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate user and return JWT token' })
  @ApiResponse({ status: 200, description: 'Successful login. Returns user payload and token.' })
  @ApiResponse({ status: 401, description: 'Invalid login credentials.' })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve logged-in user profile' })
  @ApiResponse({ status: 200, description: 'Returns the current authenticated user details.' })
  @ApiResponse({ status: 401, description: 'Unauthorized access token.' })
  async getProfile(@CurrentUser() user: any) {
    return user;
  }
}
