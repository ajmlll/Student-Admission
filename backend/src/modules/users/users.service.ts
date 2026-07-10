import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const { name, email, password, role } = createUserDto;

    // Hash the password with 12 salt rounds
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    try {
      const newUser = new this.userModel({
        name,
        email,
        password: hashedPassword,
        role,
      });
      return await newUser.save();
    } catch (error: any) {
      // Catch Mongoose duplicate key error (code 11000)
      if (error.code === 11000) {
        throw new ConflictException(`Email "${email}" is already registered`);
      }
      throw error;
    }
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByEmailWithPassword(email: string): Promise<UserDocument | null> {
    // Explicitly select password since it has select: false in schema
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }
}
