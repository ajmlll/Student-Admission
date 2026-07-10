import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn().mockImplementation((dto: RegisterDto) => {
      return Promise.resolve({
        id: 'user-id-123',
        name: dto.name,
        email: dto.email,
        role: dto.role || 'parent',
      });
    }),
    login: jest.fn().mockImplementation((dto: LoginDto) => {
      return Promise.resolve({
        accessToken: 'mock-jwt-token',
        user: {
          id: 'user-id-123',
          name: 'Test User',
          email: dto.email,
          role: 'parent',
        },
      });
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should invoke AuthService.register and return the new user', async () => {
      const dto: RegisterDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'parent',
      };

      const result = await controller.register(dto);
      expect(result).toEqual({
        id: 'user-id-123',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'parent',
      });
      expect(service.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should invoke AuthService.login and return token response', async () => {
      const dto: LoginDto = {
        email: 'john@example.com',
        password: 'password123',
      };

      const result = await controller.login(dto);
      expect(result).toEqual({
        accessToken: 'mock-jwt-token',
        user: {
          id: 'user-id-123',
          name: 'Test User',
          email: 'john@example.com',
          role: 'parent',
        },
      });
      expect(service.login).toHaveBeenCalledWith(dto);
    });
  });
});
