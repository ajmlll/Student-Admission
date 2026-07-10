import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { name, email, password, role } = registerDto;

    // Restrict public registration to parent role
    if (role === 'admission_team') {
      throw new BadRequestException(
        'Self-registration for the admission team role is disabled. Please contact the system administrator.',
      );
    }

    // Default role to parent if not provided or valid
    const userRole = role || 'parent';

    const user = await this.usersService.create({
      name,
      email,
      password,
      role: userRole,
    });

    return user;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: (user as any).id || user._id.toString(),
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: (user as any).id || user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
